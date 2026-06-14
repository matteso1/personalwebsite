#!/usr/bin/env bash
#
# onion-setup.sh — stand up Tor (.onion) + I2P (.b32.i2p) mirrors of the
# static site on a Debian/Ubuntu VPS. Run ONCE, as root, on the server.
#
#   scp scripts/onion-setup.sh root@YOUR_VPS:/root/
#   ssh root@YOUR_VPS 'bash /root/onion-setup.sh'
#
# Serves dist/ over a localhost-only nginx; Tor and i2pd are the only ways
# to reach it. The site never binds the public clearnet IP.

set -euo pipefail

WEBROOT="/srv/nils-site"
LOCAL_PORT="8080"

if [[ $EUID -ne 0 ]]; then
  echo "Run as root." >&2; exit 1
fi

echo "==> Installing tor, i2pd, nginx, rsync ..."
export DEBIAN_FRONTEND=noninteractive
apt-get update -qq
apt-get install -y -qq tor i2pd nginx rsync curl

echo "==> Web root: $WEBROOT (localhost-only on :$LOCAL_PORT)"
mkdir -p "$WEBROOT"
[[ -f "$WEBROOT/index.html" ]] || echo "<h1>mirror pending — run sync-mirror.sh</h1>" > "$WEBROOT/index.html"

cat > /etc/nginx/sites-available/nils-onion <<NGINX
server {
    listen 127.0.0.1:${LOCAL_PORT};
    server_name _;
    root ${WEBROOT};
    index index.html;
    server_tokens off;
    add_header Onion-Location http://\$onion_host\$request_uri;
    location / { try_files \$uri \$uri.html \$uri/ =404; }
}
NGINX
rm -f /etc/nginx/sites-enabled/default
ln -sf /etc/nginx/sites-available/nils-onion /etc/nginx/sites-enabled/nils-onion
# Onion-Location header needs a var; drop it if you don't want it (harmless).
sed -i '/Onion-Location/d' /etc/nginx/sites-available/nils-onion
nginx -t && systemctl enable --now nginx && systemctl reload nginx

echo "==> Configuring Tor hidden service ..."
if ! grep -q "HiddenServiceDir /var/lib/tor/nils" /etc/tor/torrc; then
  cat >> /etc/tor/torrc <<TORRC

# --- nils-site hidden service ---
HiddenServiceDir /var/lib/tor/nils/
HiddenServicePort 80 127.0.0.1:${LOCAL_PORT}
TORRC
fi
systemctl enable --now tor
systemctl restart tor
sleep 3

echo "==> Configuring i2pd server tunnel ..."
mkdir -p /var/lib/i2pd/tunnels.conf.d 2>/dev/null || true
TUN_DIR="/etc/i2pd/tunnels.conf.d"
mkdir -p "$TUN_DIR"
cat > "$TUN_DIR/nils.conf" <<I2P
[nils-site]
type = http
host = 127.0.0.1
port = ${LOCAL_PORT}
keys = nils-site.dat
I2P
systemctl enable --now i2pd
systemctl restart i2pd
sleep 8

echo
echo "============================================================"
echo " TOR address (.onion):"
if [[ -f /var/lib/tor/nils/hostname ]]; then
  cat /var/lib/tor/nils/hostname
else
  echo "  (not ready yet — check: cat /var/lib/tor/nils/hostname)"
fi
echo
echo " I2P address (.b32.i2p):"
B32=$(curl -s "http://127.0.0.1:7070/?page=i2p_tunnels" 2>/dev/null \
      | grep -oE '[a-z2-7]{52}\.b32\.i2p' | head -1 || true)
if [[ -n "${B32:-}" ]]; then
  echo "  http://${B32}"
else
  echo "  (not ready yet — open the i2pd webconsole:"
  echo "   ssh -L 7070:127.0.0.1:7070 root@THIS_VPS  then visit http://127.0.0.1:7070 -> I2P tunnels)"
fi
echo "============================================================"
echo
echo "Paste both addresses back into ONION / EEPSITE in"
echo "src/components/SiteHeader.astro, then redeploy + run sync-mirror.sh."
echo
echo "SECURITY REMINDER: rotate your root password and switch to SSH keys."

---
title: "Sentinel"
description: "A Kafka-inspired distributed log engine written from scratch in Go: LSM-tree storage, skip-list memtables, Raft consensus, and a deterministic network simulator to test it."
year: 2025
role: "Solo"
order: 3
stack: ["Go", "gRPC", "LSM-tree", "Raft", "Distributed Systems"]
receipt: "3.9M reads/s on the memtable, 45 tests"
links:
  repo: "https://github.com/matteso1/sentinel"
---

A distributed message queue written from scratch in Go to understand how a system like Kafka actually works underneath the API. Not a wrapper; the storage engine, consensus layer, and wire protocol are all hand-rolled.

## what it is

At the bottom is an LSM-tree. Writes land in an in-memory skip-list memtable (3.9M reads/s in benchmarks). When a memtable fills it flushes to an immutable SSTable on disk. Every record is CRC32-checksummed so a flipped bit gets caught on read. A write-ahead log fronts the memtable for durability: process death mid-flush replays cleanly. Leveled compaction keeps read amplification bounded.

On top sits a gRPC wire protocol with Kafka-style primitives: topics, partitions, consumer groups that track offsets.

## raft, and how to test it

A single broker is not interesting. The hard part is agreeing on write order under failures, so Sentinel implements Raft from scratch: leader election, log replication, and split-brain prevention.

Consensus bugs only show up under specific interleavings of delays and drops you cannot reliably reproduce against real sockets. The cluster runs against a deterministic in-memory network simulator. A failing run is a reproducible run.

## status

Learning project, not running production traffic. 45 tests. Code at [GitHub](https://github.com/matteso1/sentinel).

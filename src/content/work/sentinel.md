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

Sentinel is a distributed message queue I wrote from scratch in Go to understand how a system like Kafka actually works underneath the API. Not a wrapper, not a thin client over someone else's broker. The storage engine, the consensus layer, and the wire protocol are all hand-rolled, and the whole thing is held together by 45 tests.

The point was to build the parts most people treat as a black box, break them, and find out why they broke.

## The storage engine

At the bottom is a log-structured merge tree. Writes land in an in-memory skip-list memtable, which sustains 3.9M reads/s in benchmarks, and when a memtable fills it is flushed to an immutable SSTable on disk. Every record is guarded by a CRC32 checksum, so a torn write or a flipped bit gets caught on read instead of being served as silent corruption. A write-ahead log fronts the memtable for durability: if the process dies mid-flush, the WAL replays the unacknowledged writes back into memory on restart.

SSTables accumulate, so there is leveled compaction to keep read amplification bounded: overlapping tables get merged and rewritten into a higher level, dropping tombstoned and superseded keys as they go. This is the same shape of engine that sits under most modern log and key-value stores, and writing it by hand is the only way I found to really see where the tradeoffs live.

## The protocol and the broker

On top of the storage layer sits a gRPC wire protocol and the Kafka-style primitives that make it a message queue rather than a database: topics split into partitions, with consumer groups that track offsets so a group of consumers can divide a topic's partitions among themselves and resume from where they left off. Each partition is its own append-only log backed by the LSM-tree storage underneath.

## Raft, and how to test it

A single broker is not interesting. The hard part of a distributed log is agreeing on the order of writes when machines fail, so Sentinel implements Raft consensus from scratch: leader election, log replication, and the safety rules that prevent split-brain when a partition heals and two nodes both think they are leader.

Consensus code is notoriously hard to test, because the bugs only show up under specific interleavings of message delays, drops, and reorderings that you cannot reliably reproduce against real sockets. So the cluster runs against a deterministic in-memory network simulator. Messages move through a simulated network I fully control, which means I can replay an exact sequence of partitions and delays and watch the protocol either hold its invariants or violate them. A failing run is a reproducible run, which is the only way distributed-systems tests are worth anything.

## What it is

Sentinel is a learning system, built solo, and I am clear-eyed about that. It is not running anyone's production traffic. What it bought me is a working mental model of the LSM-tree-plus-Raft stack from the bytes on disk up to the consensus protocol, the kind of model that does not survive reading about these systems and only forms once you have built one and watched it fail in the simulator.

The code is on [GitHub](https://github.com/matteso1/sentinel).

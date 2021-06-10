# Module 3 fish impl order

## how and where should we start:

Define order by reading the design sheet. + text why it is good to follow a red line

1. Start with shared content
2. Start with Events from the deepest possible point (all arrows going to)
3. bubble up to the highest point
4. Continue with tags, emitter functions, fish skeleton (tags + emit) in the same order
5. implement each fish. this could be done in parallel

- impl states
- impl none shared events and tags
- impl all different kindes of fishes

## Tutorial order:

- implement shared content first.
  - impl ProductionOrderEvents
  - impl MaterialBatchEvents
  - impl BatchNumberScannerEvents
  - impl tags for ProductionOrder with type hints from MaterialBatchFish + emitter functions + fish skeleton (tags + emit)
  - impl tags for MaterialBatch with type hints from BatchNumberScannerFish + emitter functions + fish skeleton
  - impl tags for BatchNumberScanner + emitter functions + fish skeleton

- impl BatchNumberScannerFish
  - straightforward same as machineTwin
- impl MaterialBatchFish
  - adding a registry fish
- impl ProductionOrderFish
  - read the fish-design and implement states as defined
  - singleton with the same feeling as a registry but with an parameter

### Scrap:

- ~~start with the BatchNumberScanner fish (without MaterialBatch tags in the emitter functions)~~
- ~~impl MaterialBatchFish (without productionOrder)~~
- ~~add the missing tags to the BatchNumberScanner emitter functions~~

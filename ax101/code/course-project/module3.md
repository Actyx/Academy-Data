## Fish

[src/fish/module3-info.md]

## Node

some infos in the ts files



## UI

implementation order:

1. machine-Terminal
2. production-order-system

# Learning path:

## machine-Terminal

**Files**

- changed file: `App.tsx`
- new files: ``
  - `ShowBatch.tsx`: single batch
  - `ShowBatch.tsx`: materialBatch

**What you gonna learn**

- smaller, stacked components to display optional content
- handoverId to observe related fish in sub component
- fish state could be manipulated before it gets rendered. link to react.`useMemo` if it gets slow on larger operations

**Homework**

- add additional metadata as `batch size` and `available Material`
- add `consumed material by machine`

## production-order-system

- changed file: `App.tsx`
  - add tab nav + 2 pages
- batch Data
  - registry Fish
  - model view controller

**What you gonna learn**
  - optional pages / navigation
  - every component should be testable without the pond
  - controller should be exchangeable

**Homework**
  - add freeze methode to Material Batches

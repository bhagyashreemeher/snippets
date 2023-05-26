/**
 * @param {IBatch} batch
 * @param {object} $1
 * @param {boolean=} $1.filterItemsWithErrors
 * @param {boolean=} $1.filterItemsToReceive
 * @param {boolean=} $1.excludeItemsInShipments
 * @param {boolean=} $1.filterItemsMissingDimensions
 * @param {any} $1.app
 * @param {object} $1.batchItemsFilter
 * @return {{ total_count: number, total_quantity: number, total_ordered: number, total_cost: number, total_payout: number, avg_rank: number, total_rank: number, total_volume:number,total_weight:number }}}
 **/
const summarizeBatch = (
  batch,
  {
    filterItemsWithErrors,
    filterItemsToReceive,
    excludeItemsInShipments,
    filterItemsMissingDimensions,
    app,
    batchItemsFilter,
  }
) => {
  let {
    total_count = 0,
    total_quantity = 0,
    total_ordered = 0,
    total_cost = 0,
    total_payout = 0,
    total_volume = 0,
    total_weight = 0,
    avg_rank = /** @type {number} **/ (null),
  } = batch.loaded ? {} : batch;

  // const { app, batchItemsFilter } = useContext(GlobalContext);
  const { fudgeCasePacked, multipackCalculateShipmentQuantity } = app.state;

  let total_rank = 0;

  if (batch.loaded) {
    batch.items?.forEach((bi) => {
      if (filterItemsWithErrors) {
        if (
          bi.product_feed === 'error' ||
          bi.inventory_feed === 'error' ||
          bi.dimensions_feed === 'error' ||
          bi.errors?.length > 0 ||
          bi.plans?.errors?.length > 0
        ) {
          // pass - keep the condition from getting too complicated
        } else {
          return;
        }
      }

      if (Object.keys(batchItemsFilter).length > 0) {
        if (
          !bi.plans?.plans?.some((p) =>
            [].concat(...Object.values(batchItemsFilter)).some(
              (v) =>
                v.fcid === p.fcid &&
                v.prep === p.prep &&
                v.shipmentId === p.id &&
                v.cp ===
                  isCasePacked(bi, {
                    fudgeCasePacked,
                    multipackCalculateShipmentQuantity,
                  })
            )
          )
        ) {
          return;
        }
      }

      if (
        bi.deleted ||
        (filterItemsToReceive &&
          bi.quantity + (bi.damaged || 0) >= bi.ordered) ||
        (excludeItemsInShipments && bi.shipments && bi.shipments.length > 0) ||
        (filterItemsMissingDimensions && !bi.dimensions_feed)
      ) {
        return;
      }

      total_count += 1;
      total_quantity += bi.quantity;
      total_ordered += bi.ordered;
      total_cost += (bi.buylist || []).reduce(
        (sum, bl) => sum + (bl.cost || 0) * (bl.quantity || 0),
        0
      );

      total_payout += bi.inventory.payout || 0;
      total_rank += (bi.inventory.product.rank || 0) * bi.quantity;

      const { inventory } = bi;

      const { product } = inventory;

      const { misc: pmisc } = product;

      const unit = app.props.settings.metric ? 'si' : 'us';
      const lenMult = unit === 'si' ? CM : 1;
      const massMult = unit == 'si' ? KG : 1;

      const dim = (pmisc || {}).dim || /** @type {Dimensions<number>} **/ ({});
      
      const length = ((dim.length || 0) / 100) * lenMult;
      const width = ((dim.width || 0) / 100) * lenMult;
      const height = ((dim.height || 0) / 100) * lenMult;
      const weight = ((dim.weight || 0) / 100) * massMult;

      if (bi.plans?.plans?.length > 0) {
        total_volume += length * width * height * bi.quantity;
      }
      total_weight += weight * bi.quantity;
      

    });
    if (total_quantity > 0) {
      avg_rank = Math.floor(total_rank / total_quantity);
    }
    total_payout -= total_cost;
  }

  return {
    total_count,
    total_quantity,
    total_ordered,
    total_cost,
    total_payout,
    avg_rank,
    total_rank,
    total_volume,
    total_weight
  };
};

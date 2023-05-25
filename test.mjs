import { attachApp, detachApp, until, inventory } from '../common.mjs';
import { expect } from 'chai';
import { App } from '../../../src/list/js/boxt.js';
import testUtils from 'react-dom/test-utils.js';
import sinon from 'sinon';

const { act, Simulate } = testUtils;
const { spy } = sinon;

let rootContainer, app;

describe('batch items', () => {
  const listSettings = {
    msku: '$date-$asin',
    updated: '2023-01-11T17:28:53+0000',
    'labor-cost': null,
    'varsize-map': [],
    'pallet-height': '50',
    restoreBuylist: true,
    'retain-unlisted': false,
    'pallet-thickness': '5',
    'pallet-utilization': '85',
    'inbound-shipping-cost': null,
    'print-on-shipment-plan': false,
    'show-pallet-utilization': true,
  };

  before(async () => {
    rootContainer = await attachApp(App, { listSettings });
    app = window.app;

    await until(() => !app.state.shipments.loading);

    spy(App.prototype, 'updateBatchItem');
    spy(App.prototype, 'onBatchItemDeleted');
  });

  after(() => {
    App.prototype.updateBatchItem.restore();
    App.prototype.onBatchItemDeleted.restore();
    detachApp(rootContainer);
    rootContainer = null;
  });

  // Add items to a batch by listing individually and imports
  describe('creating batch items', () => {
    it('should add items to the batch if not already in the batch');
    it('should only add items that are not in shipments to the batch');
    it(
      'should display Listed Batch Items dialog if any of the items being added are already in a shipment'
    );

    describe('Listed batch items dialog', () => {
      it(
        'should list items that cannot be added to the batch due to being in shipments'
      );
      it('should display title and msku of each item');
    });
  });

  describe('updating batch items', () => {
    before(async function () {
      await act(
        async () =>
          (this.batch = await app.createBatch({
            ship_from: '1',
            marketplace: 'US',
            name: 'Test Batch Items',
          }))
      );
    });

    it('should show the batch item list when a batch is selected', async () => {
      const container = rootContainer.querySelector('.boxes-container');

      expect(
        container.querySelector('.batch-header .content-pane-title').textContent
      ).to.match(/Test Batch Items/);
    });

    it('should show total cost if user has `boxt-cost` role');
    it('should hide total cost if user does not have `boxt-cost` role');
    it('should show total net payout if user has `net-payout` role');
    it('should hide total net payout if user does not have `net-payout` role');

    it('should update the view when a batch item is added', async function () {
      await act(
        async () =>
          (this.bi = (
            await app.createBatchItems(this.batch._id, [
              {
                inventory,
                quantity: 1,
                multipack: 1,
                buylist: [{ cost: 321 }],
              },
            ])
          )[0])
      );

      expect(
        rootContainer.querySelector(`#batch-item-${this.bi._id}`).className
      ).to.match(/X002L3W3OL/);
    });

    describe('batch item info', () => {
      it('should display UPC');
      it('should display MSKU');
      it('should display condition if ON in showColumns');
      it('should not display condition if OFF in showColumns');
      it('should display FNSKU');
      it('should display price if ON in showColumns');
      it('should display not price if ON in showColumns');
      it('should display cost if ON in showColumns');
      it('should not display cost if OFF in showColumns');
      it('should display source if ON in showColumns');
      it('should not display source if OFF in showColumns');
      it('should display expires if ON in showColumns');
      it('should not display expires if OFF in showColumns');
      it('should display ASIN');
      it('should display category if ON in showColumns', function () {
        const biDom = rootContainer.querySelector(`#batch-item-${this.bi._id}`);

        if (!app.state.showColumns.includes('category')) {
          const showColumns = [...app.state.showColumns, 'category'];
          act(() => app.setState({ showColumns: showColumns }));
        }

        expect(biDom.querySelector('.item-details .category')).to.not.be.null;
        expect(biDom.querySelector('.item-details .category').textContent).to
          .not.be.null;
        expect(
          biDom.querySelector('.item-details .category').textContent
        ).to.be.equal('Apparel');
      });

      it('should not display category if OFF in showColumns', function () {
        const biDom = rootContainer.querySelector(`#batch-item-${this.bi._id}`);

        if (app.state.showColumns.includes('category')) {
          const showColumns = app.state.showColumns.filter(
            (s) => s !== 'category'
          );
          act(() => app.setState({ showColumns: showColumns }));
        }
        expect(biDom.querySelector('.item-details .category')).to.be.null;
      });

      it('should display storage type if ON in showColumns', function () {
        const biDom = rootContainer.querySelector(`#batch-item-${this.bi._id}`);

        if (!app.state.showColumns.includes('storage_type')) {
          const showColumns = [...app.state.showColumns, 'storage_type'];
          act(() => app.setState({ showColumns: showColumns }));
        }

        expect(biDom.querySelector('.item-details .storage-type')).to.not.be
          .null;
        expect(biDom.querySelector('.item-details .storage-type').textContent)
          .to.not.be.null;
        expect(
          biDom.querySelector('.item-details .storage-type').textContent
        ).to.be.equal('Standard');
      });

      it('should not display storage type if OFF in showColumns', function () {
        const biDom = rootContainer.querySelector(`#batch-item-${this.bi._id}`);

        if (app.state.showColumns.includes('storage_type')) {
          const showColumns = app.state.showColumns.filter(
            (s) => s !== 'storage_type'
          );
          act(() => app.setState({ showColumns: showColumns }));
        }
        expect(biDom.querySelector('.item-details .storage-type')).to.be.null;
      });
      it('should display dimensions');
      it('should display unit weight');
      it('should display rank if ON in showColumns', function () {
        const biDom = rootContainer.querySelector(`#batch-item-${this.bi._id}`);

        if (!app.state.showColumns.includes('rank')) {
          const showColumns = [...app.state.showColumns, 'rank'];
          act(() => app.setState({ showColumns: showColumns }));
        }

        expect(biDom.querySelector('.item-details .rank')).to.not.be.null;
        expect(biDom.querySelector('.item-details .rank').textContent).to.not.be
          .null;
        expect(
          biDom.querySelector('.item-details .rank').textContent
        ).to.be.equal('1,061,387');
      });

      it('should not display rank if OFF in showColumns', function () {
        const biDom = rootContainer.querySelector(`#batch-item-${this.bi._id}`);

        if (app.state.showColumns.includes('rank')) {
          const showColumns = app.state.showColumns.filter((s) => s !== 'rank');
          act(() => app.setState({ showColumns: showColumns }));
        }
        expect(biDom.querySelector('.item-details .rank')).to.be.null;
      });

      describe('when isWarehouse setting is OFF', () => {
        it('should display quantity');
        it('should not display ordered quantity');
      });

      describe('when multipackCalculateShipmentQuantity setting is OFF', () => {
        it('should not display shipment quantity');
        it('should not display overage quantity');
        it('should not display damaged quantity');
      });

      describe('when isWarehouse setting is ON', () => {
        it('should display received quantity');
        it('should display ordered quantity ');
      });

      describe('when multipackCalculateShipmentQuantity setting is ON', () => {
        it('should display shipment quantity');
        it('should display overage quantity');
        it('should display damaged quantity');
      });
    });

    describe('editing a batch item', () => {
      it('should display the editor when pressing the edit button', function () {
        const biDom = rootContainer.querySelector(`#batch-item-${this.bi._id}`);

        act(() => Simulate.click(biDom.querySelector('button.edit')));

        // if user has `boxt-price` role
        expect(biDom.querySelector('.price input').value).to.equal('199.98');
        // else expect no price input
        // if user has `boxt-cost` role
        expect(biDom.querySelector('.cost input').value).to.equal('3.21');
        // else expect no cost input
        expect(biDom.querySelector('.add-quantity input').value).to.equal('0');
        expect(biDom.querySelector('.expires input').value).to.equal('');

        it('should display source field when source is ON in showColumns', function () {
          if (!app.state.showColumns.includes('source')) {
            const showColumns = [...app.state.showColumns, 'source'];
            act(() => app.setState({ showColumns: showColumns }));
          }

          expect(biDom.querySelector('.source input').value).to.not.be.null;
        });

        it('should not display source field when source is OFF in showColumns', function () {
          if (app.state.showColumns.includes('source')) {
            const showColumns = app.state.showColumns.filter(
              (s) => s !== 'source'
            );
            act(() => app.setState({ showColumns: showColumns }));
          }

          expect(biDom.querySelector('.source input').value).to.be.null;
        });

        describe('when isWarehouse setting is OFF', () => {
          describe('When item is not case-packed', () => {
            it('should display add quantity input');
            it(
              'should not display quantity in case and number of cases when quantity-in-case is not set on batch item'
            );
            it('should not report validity for add number input');
          });

          describe('When item is case-packed', () => {
            it(
              'should display quantity in case and number of cases when quantity-in-case is set on batch item'
            );
            it('should display add quantity input');
            it('should update add quantity when quantity in case is changed');
            it('should update add quantity when number of cases is changed');
            it('should show quantity in case input invalid if not set');
            it('should set add quantity to 0 when quantity in case is not set');
            it('should show number of cases input invalid if not set');
            it('should set add quantity to 0 when number of cases is not set');
            it('should update number of cases when add quantity is changed');
            it(
              'should report validity and not save when quantity in case is not set'
            );
            it(
              'should report validity and not save when number of cases is not set'
            );
            it(
              'should report validity and not save when add number plus quantity is not a multiple of quantity in case'
            );
          });
        });

        describe('when isWarehouse setting is ON', () => {
          it('should not display receive remaining if item is listed');

          describe('When item is not case-packed', () => {
            it('should display add quantity input');
          });

          describe('When item is case-packed', () => {
            it(
              'should disable quantity in case and number of cases inputs if multipackCalculateShipmentQuantity setting is ON'
            );
            it(
              'should disable number of cases input if multipackCalculateShipmentQuantity setting is OFF'
            );
            it('should display add number of cases received input');
            it(
              'should save received quantity as quantity in case x number of cases received'
            );
            it(
              'should disable quantity in case input when cased received input changes'
            );
            it('should disable quantity in case input when item is received');
          });
        });

        describe('when show-prep-instructions is ON', () => {
          it('should display who preps dropdown');
          it('should display who prep instructions select');
          it('should display who labels dropdown');
        });
      });

      it(
        'should display who preps, prep instructions, and who labels when show-prep-instructions is ON'
      );
      it(
        'should default "Who Preps?" to SELLER if no non-Labeling prep instruction'
      );
      it(
        'should display PrepOwner of non-Labeling prep instruction from batch-item for "Who Preps?"'
      );
      it('should display prep instructions from the inventory is set');
      it(
        'should display prep instructions from the batch item is set and not on inventory'
      );
      it(
        'should default "Who Labels?" to SELLER if no Labeling prep instruction'
      );
      it(
        'should display PrepOwner of Labeling prep instruction from batch-item for "Who Labels?"'
      );

      it('should display shipment, overage, and damaged when multipackCalculateShipmentQuantity is checked', function () {
        // We should probably click the checkbox instead of just setting the state
        act(() => app.setState({ multipackCalculateShipmentQuantity: true }));
        const biDom = rootContainer.querySelector(`#batch-item-${this.bi._id}`);
        expect(biDom.querySelector('.shipment').textContent).to.equal(
          '1 (⌊1 / 1⌋)'
        );

        expect(biDom.querySelector('.overage').textContent).to.equal(
          '0 (1 - (1 × 1))'
        );
        expect(biDom.querySelector('.damaged input').value).to.equal('0');
      });

      it('should display ordered when isWarehouse setting is ON', function () {
        // We should probably click the checkbox instead of just setting the state
        act(() => app.setState({ isWarehouse: true }));
        const biDom = rootContainer.querySelector(`#batch-item-${this.bi._id}`);
        expect(biDom.querySelector('.ordered input').value).to.equal('1');
      });

      it('should set "add to received quantity" to the remaining unordered quantity if user clicks copy icon', function () {
        const biDom = rootContainer.querySelector(`#batch-item-${this.bi._id}`);
        act(() => Simulate.click(biDom.querySelector('.fa-reply')));
        expect(biDom.querySelector('.add-quantity input').value).to.equal(
          String(
            parseInt(biDom.querySelector('.ordered input').value, 10) -
              parseInt(biDom.querySelector('.quantity').textContent, 10)
          )
        );
      });

      it('should reset the values if another workstation updates the item', function () {
        const biDom = rootContainer.querySelector(`#batch-item-${this.bi._id}`);

        biDom.querySelector('.ordered input').value = '10';
        act(() => Simulate.change(biDom.querySelector('.ordered input')));
        biDom.querySelector('.cost input').value = '5.55';
        act(() => Simulate.change(biDom.querySelector('.cost input')));

        act(() =>
          app.onBatchItemUpdated({
            _id: this.bi._id,
            batch_id: this.bi.batch_id,
            ordered: 3,
          })
        );

        expect(biDom.querySelector('.ordered input').value).to.equal('3');
        expect(biDom.querySelector('.cost input').value).to.equal('3.21');
      });

      // TODO - I'm not sure the best place to show this -zak
      it(
        'should show who made the change if another workstation updates the item'
      );
      it('should animate changes made by another workstation');

      it('should reset the values when the user presses cancel', function () {
        const biDom = rootContainer.querySelector(`#batch-item-${this.bi._id}`);

        biDom.querySelector('.add-quantity input').value = '2';
        act(() => Simulate.change(biDom.querySelector('.add-quantity input')));
        biDom.querySelector('.cost input').value = '5.55';
        act(() => Simulate.change(biDom.querySelector('.cost input')));

        act(() => Simulate.click(biDom.querySelector('button.cancel')));

        expect(biDom.querySelector('.quantity').textContent).to.equal('1');
        expect(biDom.querySelector('.cost').textContent).to.match(/\$3\.21/);

        expect(App.prototype.updateBatchItem).to.have.property('callCount', 0);
      });

      it('should save the values when the user presses save', async function () {
        const biDom = rootContainer.querySelector(`#batch-item-${this.bi._id}`);

        act(() => Simulate.click(biDom.querySelector('button.edit')));

        biDom.querySelector('.add-quantity input').value = '2';
        act(() => Simulate.change(biDom.querySelector('.add-quantity input')));

        act(() => Simulate.click(biDom.querySelector('button.save')));

        expect(App.prototype.updateBatchItem).to.have.property('callCount', 1);

        // wait until we go out of edit mode to finish this test
        await until(() => !biDom.querySelector('button.save'));
      });

      it('should save the values when user hits Enter on any of the inputs', async function () {
        const biDom = rootContainer.querySelector(`#batch-item-${this.bi._id}`);

        act(() => Simulate.click(biDom.querySelector('button.edit')));

        const inputs = Array.from(biDom.querySelectorAll('input'));

        for (let i = 0; i < inputs.length; i++) {
          if (i !== 0) {
            act(() =>
              Simulate.click(
                rootContainer.querySelector('.batch-item button.edit')
              )
            );
          }

          const input = biDom.querySelectorAll('input').item(i);

          act(() =>
            Simulate.keyDown(input, { key: 'Enter', keyCode: 13, which: 13 })
          );

          // wait until we go out of edit mode to finish this test
          await until(() => !biDom.querySelector('button.save'));

          expect(App.prototype.updateBatchItem).to.have.property(
            'callCount',
            i + 2
          );
        }
      });

      it('should update the view when a batch item changes', function () {
        act(() => {
          app.onBatchItemUpdated({
            _id: this.bi._id,
            batch_id: this.bi.batch_id,
            ordered: 5,
            quantity: 4,
            multipack: 2,
            damaged: 1,
            inventory: {
              ...inventory,
              price: 1998,
            },
            buylist: [{ cost: 123 }],
          });
        });

        const biDom = rootContainer.querySelector(`#batch-item-${this.bi._id}`);

        expect(biDom.querySelector('.price').textContent).to.equal('$19.98');
        expect(biDom.querySelector('.cost').textContent).to.equal('$1.23');
        expect(biDom.querySelector('.ordered').textContent).to.equal('5');
        expect(biDom.querySelector('.quantity').textContent).to.equal('4');
        // expect( biDom.querySelector('.multipack').textContent ).to.equal( '2' );
        // expect( biDom.querySelector('.damaged').textContent ).to.equal( '1' );
        // ... tags
      });

      describe('the delete button', () => {
        it('should display the delete button when pressing the edit button and item is not listed', function () {
          const biDom = rootContainer.querySelector(
            `#batch-item-${this.bi._id}`
          );

          act(() => Simulate.click(biDom.querySelector('button.edit')));

          expect(biDom.querySelector('button.delete').className).to.match(
            /delete/
          );
        });

        describe('delete confirmation dialog', () => {
          before(function () {
            const biDom = rootContainer.querySelector(
              `#batch-item-${this.bi._id}`
            );

            act(() => Simulate.click(biDom.querySelector('button.delete')));
          });

          it('should show the dialog when pressing the delete button', () => {
            expect(rootContainer.querySelector('.modal').className).to.match(
              /delete-batch-item-modal/
            );
          });

          it('should not show the restore buylist checkbox if warehouse mode is on', () => {
            expect(
              rootContainer.querySelector(
                '.delete-batch-item-modal .restore-buylist-checkbox'
              )
            ).to.equal(null);
          });

          it('should show restore buylist checkbox unchecked if restoreBuylist is undefined in List settings', () => {
            act(() =>
              app.setState({ isWarehouse: false, restoreBuylist: undefined })
            );
            expect(
              rootContainer.querySelector(
                '.delete-batch-item-modal .restore-buylist-checkbox'
              ).checked
            ).to.equal(false);
          });

          it('should show restore buylist checkbox unchecked if restoreBuylist is set to false in List settings', () => {
            act(() =>
              app.setState({ isWarehouse: false, restoreBuylist: false })
            );
            expect(
              rootContainer.querySelector(
                '.delete-batch-item-modal .restore-buylist-checkbox'
              ).checked
            ).to.equal(false);
          });

          it('should show restore buylist checkbox checked if restoreBuylist is set to true in List settings', () => {
            act(() =>
              app.setState({ isWarehouse: false, restoreBuylist: true })
            );
            expect(
              rootContainer.querySelector(
                '.delete-batch-item-modal .restore-buylist-checkbox'
              ).checked
            ).to.equal(true);
          });

          it('should save restoreBuylist List setting to false when unchecked', () => {
            // TODO - I suspect this is a similar issue with the callCount not getting updated on `onBatchItemDeleted`,
            // but I verified that it's working - Phil
            /*
              act(() => Simulate.click( rootContainer.querySelector('.delete-batch-item-modal .restore-buylist-checkbox') ));
              expect( App.prototype.saveListSettings ).to.have.property('callCount', 1);
            */
          });

          it('should close the dialog when pressing the cancel button', () => {
            act(() =>
              Simulate.click(
                rootContainer.querySelector('.modal button.cancel')
              )
            );

            expect(
              rootContainer.querySelector('.delete-batch-item-modal')
            ).to.equal(null);
          });

          it(
            'should close the dialog and delete the item when pressing the delete buton' /*function() {

const biDom = rootContainer.querySelector(`#batch-item-${this.bi._id}`);

act(() => Simulate.click( biDom.querySelector('button.delete') ));

expect( rootContainer.querySelector('.modal').className )
.to.match( /delete-batch-item-modal/ );


act(() => Simulate.click( rootContainer.querySelector('.modal button.confirm') ));

// TODO - The callCount isn't getting updated, but I've confirmed that the function is
// actually geting called -zak
// expect( App.prototype.onBatchItemDeleted ).to.have.property('callCount', 1);
expect( rootContainer.querySelector('#batch-item-0') ).to.equal( null );
expect( rootContainer.querySelector('.delete-batch-item-modal') ).to.equal( null );
// TODO - verify updateBuylistItem is called when restoreBuylist checkbox is checked

}*/
          );
        });
      });
    });

    describe('editing a listed batch item', () => {
      before(async function () {
        await act(
          async () =>
            (this.batch = await app.createBatch({
              ship_from: '1',
              marketplace: 'US',
              name: 'Test Batch Listed Items',
            }))
        );

        await act(
          async () =>
            (this.bi = (
              await app.createBatchItems(this.batch._id, [
                {
                  inventory,
                  quantity: 2,
                  multipack: 1,
                  buylist: [{ cost: 321 }],
                },
              ])
            )[0])
        );

        act(() => {
          app.updateBatchState(this.bi.batch_id, (batch) => {
            const found = batch.items.find((bi) => bi._id === this.bi._id);
            if (found) {
              found.shipments = ['FBAABC123'];
            }
            return batch;
          });
        });
      });

      it('should disable ordered, quantity, multipack, and damaged inputs if item is listed', function () {
        const biDom = rootContainer.querySelector(`#batch-item-${this.bi._id}`);

        act(() =>
          app.setState({ isWarehouse: true, showColumns: ['multipack'] })
        );
        act(() => Simulate.click(biDom.querySelector('button.edit')));

        expect(biDom.querySelector('.multipack input').disabled).to.equal(true);
        expect(biDom.querySelector('.ordered input').disabled).to.equal(true);
        expect(biDom.querySelector('.add-quantity input').disabled).to.equal(
          true
        );
        expect(biDom.querySelector('.damaged input').disabled).to.equal(true);
      });

      it('should display expiration date note if item is listed', function () {
        const biDom = rootContainer.querySelector(`#batch-item-${this.bi._id}`);

        act(() => app.setState({ showColumns: ['expires'] }));

        expect(biDom.querySelector('.modify-expires-note').className).to.match(
          /modify-expires-note/
        );
      });

      it('should not display copy ordered to received icon if item is listed', function () {
        const biDom = rootContainer.querySelector(`#batch-item-${this.bi._id}`);

        expect(!biDom.querySelector('.ordered .fa-reply'));
      });

      it('should not display the delete button when pressing the edit button and item is listed', function () {
        const biDom = rootContainer.querySelector(`#batch-item-${this.bi._id}`);

        expect(!biDom.querySelector('.button.delete'));
      });

      it('should update the expiration date of associated shipment items when the user presses save on a listed item', async function () {
        const shipmentId = 'FBAABC123';

        // Load the shipment items since it may not be in the state
        await act(async () => {
          await app.loadBoxesAndItems(shipmentId);
        });

        const shipment = app.getShipment(shipmentId);

        // Fake the state by adding the batch item buylist to the shipment item
        act(() => {
          app.updateShipmentState(shipmentId, {
            items: Object.entries(shipment.items).reduce(
              (acc, [id, si]) => ({
                ...acc,
                [id]:
                  si.inventory.msku === inventory.msku
                    ? { ...si, buylist: this.bi.buylist }
                    : si,
              }),
              {}
            ),
          });
        });

        act(() => {
          app.updateBatchState(this.bi.batch_id, (batch) => {
            const found = batch.items.find((bi) => bi._id === this.bi._id);
            if (found) {
              found.buylist[0].expires = '2022-12-04T00:00:00.000Z';
            }
            return batch;
          });
        });

        act(() => {
          app.onBatchItemUpdated(app.getBatch().items[0]);
        });

        expect(Object.values(shipment.items)[0].buylist[0].expires).to.equal(
          this.bi.buylist[0].expires
        );
      });
    });

    describe('when an item is added to a batch', () => {
      it('should update the batch summary');
      it('should ensure the "Create Listings" button state remains correct');
      it(
        'should ensure the "Create Shipment Plan" button state remains correct'
      );
    });

    describe('when an item is deleted from a batch', () => {
      it('should update the batch summary');
      it('should remove item from view');
    });
  });

  describe('batch filters', () => {
    before(async function () {
      // Create test batch
      await act(
        async () =>
          (this.batch = await app.createBatch({
            ship_from: '1',
            marketplace: 'US',
            name: 'Test Batch Filters',
          }))
      );

      // Load inventory info for given MSKUs
      await act(
        async () =>
          (this.inventory = await app.loadInventory({
            filters: {
              q: ['X002L3W3OL', 'X000FW8W09', 'X0028BAL0T', 'X0022O9VNF'],
            },
          }))
      );

      act(() => app.setState({ isWarehouse: true }));

      // Create the batch items
      await act(
        async () =>
          (this.batchItems = await app.createBatchItems(
            this.batch._id,
            this.inventory.data.map((inventory) => ({
              inventory,
              quantity: 2,
              buylist: [{ cost: 500 }],
            }))
          ))
      );

      // Load batch items
      act(() => app.setState({ currentBatch: this.batch._id }));
      await act(() => app.loadBatchItems(this.batch._id));

      // fake the update
      act(() => {
        this.batchItems.map((item, i) =>
          app.onBatchItemUpdated({
            _id: item._id,
            batch_id: item.batch_id,
            quantity: i === 0 ? 1 : i === 1 ? 2 : 0,
            damaged: i === 0 ? 1 : 0,
            shipments: i === 0 ? ['FBA123456789'] : null,
            errors: i === 2 ? ['Error!'] : null,
            inventory: {
              ...item.inventory,
              // ensure that feed errors are considered
              active: [0, 1, 2].includes(i) ? false : item.inventory.active,
              product_feed_status: i === 0 ? 'HasErrors' : null,
              product_feed_errors: i === 0 ? ['Failed!'] : null,
              product_feed_batch_id: i === 0 ? this.batch._id : null,
              inventory_feed_status: i === 1 ? 'HasErrors' : null,
              inventory_feed_errors: i === 1 ? ['Failed!'] : null,
              inventory_feed_batch_id: i === 1 ? this.batch._id : null,
            },
            product_feed: i === 0 ? 'error' : null,
            inventory_feed: i === 1 ? 'error' : null,
            plans:
              i === 0
                ? {
                    plans: [
                      {
                        id: 'FBA123456789',
                        fcid: 'FTW3',
                        prep: 'SELLER_LABEL',
                      },
                    ],
                  }
                : null,
          })
        );
      });
    });

    describe('filterItemsWithErrors', () => {
      describe('when checked', () => {
        it('should only show items with product/inventory feed errors or shipment errors', () => {
          act(() => app.setState({ filterItemsWithErrors: true }));
          expect(
            rootContainer.querySelectorAll('.batch-items .batch-item').length
          ).to.equal(3);
        });

        it('should update the summary to reflect filtered items', () => {
          expect(
            rootContainer.querySelector('.batch-header .summary .skus')
              .textContent
          ).to.match(/3 SKUs/);
        });
      });
      describe('when unchecked', () => {
        it('should show all items', () => {
          act(() => app.setState({ filterItemsWithErrors: false }));
          expect(
            rootContainer.querySelectorAll('.batch-items .batch-item').length
          ).to.equal(4);
        });

        it('should update the summary to reflect all items', () => {
          expect(
            rootContainer.querySelector('.batch-header .summary .skus')
              .textContent
          ).to.match(/4 SKUs/);
        });
      });
    });

    describe('excludeItemsInShipments', () => {
      describe('when checked', () => {
        it('should only show items that are not in shipments', () => {
          act(() => app.setState({ excludeItemsInShipments: true }));
          expect(
            rootContainer.querySelectorAll('.batch-items .batch-item').length
          ).to.equal(3);
        });

        it('should update the summary to reflect filtered items', () => {
          expect(
            rootContainer.querySelector('.batch-header .summary .skus')
              .textContent
          ).to.match(/3 SKUs/);
        });
      });

      describe('when unchecked', () => {
        it('should show all items', () => {
          act(() => app.setState({ excludeItemsInShipments: false }));
          expect(
            rootContainer.querySelectorAll('.batch-items .batch-item').length
          ).to.equal(4);
        });

        it('should update the summary to reflect all items', () => {
          expect(
            rootContainer.querySelector('.batch-header .summary .skus')
              .textContent
          ).to.match(/4 SKUs/);
        });
      });
    });

    describe('filterItemsToReceive', () => {
      describe('when checked', () => {
        it('should only show items where received quantity + damaged < ordered', async () => {
          act(() =>
            app.setState({
              filterItemsToReceive: true,
              multipackCalculateShipmentQuantity: true,
            })
          );
          const bisDom = rootContainer.querySelectorAll(
            '.batch-items .batch-item'
          );
          expect(bisDom.length).to.equal(2);

          Array.from(bisDom).forEach((bi) => {
            const received = parseInt(
              bi.querySelector('.quantity').textContent,
              10
            );
            const damaged = parseInt(
              bi.querySelector('.damaged').textContent,
              10
            );
            const ordered = parseInt(
              bi.querySelector('.ordered').textContent,
              10
            );
            expect(received + damaged).to.be.below(ordered);
          });
        });

        it('should update the summary to reflect filtered items', () => {
          expect(
            rootContainer.querySelector('.batch-header .summary .skus')
              .textContent
          ).to.match(/2 SKUs/);
        });
      });

      describe('when unchecked', () => {
        it('should show all items', () => {
          act(() => app.setState({ filterItemsToReceive: false }));
          expect(
            rootContainer.querySelectorAll('.batch-items .batch-item').length
          ).to.equal(4);
        });

        it('should update the summary to reflect all items', () => {
          expect(
            rootContainer.querySelector('.batch-header .summary .skus')
              .textContent
          ).to.match(/4 SKUs/);
        });
      });
    });
    describe('filter by shipment', () => {
      describe('when checked', async () => {
        it('should show list of filters', async () => {
          act(() =>
            app.setState({
              filterItemsToReceive: false,
              multipackCalculateShipmentQuantity: false,
            })
          );
          await until(() => !app.state.batches.loading);

          await until(() => !app.state.batches.loading);

          const bisDom = rootContainer.querySelectorAll(
            '.batch-items .batch-item'
          );
          expect(bisDom.length).to.equal(4);
        });

        it('should update the summary to reflect filtered items', () => {
          act(() =>
            app.setState({
              batchItemsFilter: {
                FBA123456789: [
                  {
                    fcid: 'FTW3',
                    quantity: 5,
                    cp: false,
                    prep: 'SELLER_LABEL',
                    shipmentId: 'FBA123456789',
                    selected: true,
                  },
                ],
              },
            })
          );
          const bisDom = rootContainer.querySelectorAll(
            '.batch-items .batch-item'
          );
          expect(bisDom.length).to.equal(1);

          expect(
            rootContainer.querySelector('.batch-header .summary .skus')
              .textContent
          ).to.match(/1 SKU/);
        });
      });
    });
  });

  describe('Sorting', () => {
    before(() => {
      act(() =>
        app.setState({
          batchItemsFilter: {},
        })
      );
      if (!app.state.showColumns.includes('category')) {
        const showColumns = [...app.state.showColumns, 'category'];
        act(() => app.setState({ showColumns: showColumns }));
      }
    });
    it('should sort by created desc by default', () => {
      const batchItemsDom = Array.from(
        rootContainer.querySelectorAll('.batch-items .batch-item')
      );

      expect(
        Array.from(
          rootContainer.querySelector(
            '.batch-items-sort-container .batch-items-sort-dir'
          ).classList
        )
      ).to.include('fa-sort-amount-desc');
      expect(
        rootContainer.querySelector(
          '.batch-items-sort-container #batch-items-sort-by'
        ).value
      ).to.equal('created');
      expect(batchItemsDom[0].id).to.equal('batch-item-6');
      expect(batchItemsDom[1].id).to.equal('batch-item-5');
      expect(batchItemsDom[2].id).to.equal('batch-item-4');
      expect(batchItemsDom[3].id).to.equal('batch-item-3');
    });

    it('should sort by created asc if sorting by desc and user clicks the direction icon', () => {
      act(() =>
        Simulate.click(
          rootContainer.querySelector(
            '.batch-items-sort-container .batch-items-sort-dir'
          )
        )
      );

      expect(
        Array.from(
          rootContainer.querySelector(
            '.batch-items-sort-container .batch-items-sort-dir'
          ).classList
        )
      ).to.include('fa-sort-amount-asc');

      const batchItemsDom = Array.from(
        rootContainer.querySelectorAll('.batch-items .batch-item')
      );

      expect(batchItemsDom[0].id).to.equal('batch-item-3');
      expect(batchItemsDom[1].id).to.equal('batch-item-4');
      expect(batchItemsDom[2].id).to.equal('batch-item-5');
      expect(batchItemsDom[3].id).to.equal('batch-item-6');
    });

    it('should sort by category asc if sorting asc and user changes sort by', () => {
      const sortByDropdown = rootContainer.querySelector(
        '.batch-items-sort-container #batch-items-sort-by'
      );

      sortByDropdown.value = 'category';
      act(() => Simulate.change(sortByDropdown));

      const batchItemsDom = Array.from(
        rootContainer.querySelectorAll('.batch-items .batch-item')
      );

      expect(batchItemsDom[0].querySelector('.category').textContent).to.equal(
        'Apparel'
      );
      expect(batchItemsDom[1].querySelector('.category').textContent).to.equal(
        'Book'
      );
      expect(batchItemsDom[2].querySelector('.category').textContent).to.equal(
        'Musical Instruments'
      );
      expect(batchItemsDom[3].querySelector('.category').textContent).to.equal(
        'Toy'
      );
    });

    it('should sort by category desc if sorting asc and user clicks the direction icon', () => {
      act(() =>
        Simulate.click(
          rootContainer.querySelector(
            '.batch-items-sort-container .batch-items-sort-dir'
          )
        )
      );

      expect(
        Array.from(
          rootContainer.querySelector(
            '.batch-items-sort-container .batch-items-sort-dir'
          ).classList
        )
      ).to.include('fa-sort-amount-desc');

      const batchItemsDom = Array.from(
        rootContainer.querySelectorAll('.batch-items .batch-item')
      );

      expect(batchItemsDom[0].querySelector('.category').textContent).to.equal(
        'Toy'
      );
      expect(batchItemsDom[1].querySelector('.category').textContent).to.equal(
        'Musical Instruments'
      );
      expect(batchItemsDom[2].querySelector('.category').textContent).to.equal(
        'Book'
      );
      expect(batchItemsDom[3].querySelector('.category').textContent).to.equal(
        'Apparel'
      );
    });

    it('should sort by created desc if sorting desc and user changes sort by', () => {
      const sortByDropdown = rootContainer.querySelector(
        '.batch-items-sort-container #batch-items-sort-by'
      );

      sortByDropdown.value = 'created';
      act(() => Simulate.change(sortByDropdown));

      const batchItemsDom = Array.from(
        rootContainer.querySelectorAll('.batch-items .batch-item')
      );

      expect(batchItemsDom[0].id).to.equal('batch-item-6');
      expect(batchItemsDom[1].id).to.equal('batch-item-5');
      expect(batchItemsDom[2].id).to.equal('batch-item-4');
      expect(batchItemsDom[3].id).to.equal('batch-item-3');
    });

    it('should sort by storage type desc if sorting by desc and user changes sort by', () => {
      const sortByDropdown = rootContainer.querySelector(
        '.batch-items-sort-container #batch-items-sort-by'
      );

      sortByDropdown.value = 'storage_type';
      act(() => Simulate.change(sortByDropdown));

      const batchItemsDom = Array.from(
        rootContainer.querySelectorAll('.batch-items .batch-item')
      );

      expect(batchItemsDom[0].id).to.equal('batch-item-4');
      expect(batchItemsDom[1].id).to.equal('batch-item-3');
      expect(batchItemsDom[2].id).to.equal('batch-item-6');
      expect(batchItemsDom[3].id).to.equal('batch-item-5');
    });

    it('should sort by storage type asc if sorting by desc and user clicks the direction icon', () => {
      act(() =>
        Simulate.click(
          rootContainer.querySelector(
            '.batch-items-sort-container .batch-items-sort-dir'
          )
        )
      );

      expect(
        Array.from(
          rootContainer.querySelector(
            '.batch-items-sort-container .batch-items-sort-dir'
          ).classList
        )
      ).to.include('fa-sort-amount-asc');

      const batchItemsDom = Array.from(
        rootContainer.querySelectorAll('.batch-items .batch-item')
      );

      expect(batchItemsDom[0].id).to.equal('batch-item-5');
      expect(batchItemsDom[1].id).to.equal('batch-item-6');
      expect(batchItemsDom[2].id).to.equal('batch-item-4');
      expect(batchItemsDom[3].id).to.equal('batch-item-3');
    });
  });

  describe('batch headers', () => {
    before(async function () {
      // Create test batch
      await act(
        async () =>
          (this.batch = await app.createBatch({
            ship_from: '1',
            marketplace: 'US',
            name: 'Test Batch Items',
          }))
      );

      // Load inventory info for given MSKUs
      await act(
        async () =>
          (this.inventory = await app.loadInventory({
            filters: {
              q: [
                'B001FOQJOG-076',
                '2013-04-19-B004CRYE2C-UA',
                '0553537865-PM',
                '2019-02-26-B01AXY5YD0-868',
              ],
            },
          }))
      );

      act(() => app.setState({ isWarehouse: true }));

      // Create the batch items
      await act(
        async () =>
          (this.batchItems = await app.createBatchItems(
            this.batch._id,
            this.inventory.data.map((inventory) => ({
              inventory,
              quantity: 2,
              buylist: [{ cost: 500 }],
            }))
          ))
      );

      // Load batch items
      act(() => app.setState({ currentBatch: this.batch._id }));
      await act(() => app.loadBatchItems(this.batch._id));

      const mock_inventory = {
        condition: 'NewItem',
        fnsku: 'X002L3W3OL',
        msku: 'B001FOQJOG-076',
        marketplace: 'US',
        price: 19998,
        misc: {},
        product: {
          title: 'His Crown is pechalat by Jig',
          asin: 'B001FOQJOG',
          image: 'https://m.media-amazon.com/images/I/41i9dZlSsmL.jpg',
          misc: {
            dim: { width: 1499, height: 1349, length: 2474, weight: 2255 },
          },
          upc: ['9781477058435'],
          rank: 123456,
        },
      };
      // fake the update
      act(() => {
        this.batchItems.map((item, i) =>
          app.onBatchItemUpdated({
            _id: item._id,
            batch_id: item.batch_id,
            quantity: i === 0 ? 1 : i === 1 ? 2 : 0,
            damaged: i === 0 ? 1 : 0,
            shipments: i === 0 ? ['FBA123456789'] : null,
            errors: i === 2 ? ['Error!'] : null,
            inventory: {
              ...mock_inventory,
              product_feed_status: i === 0 ? 'HasErrors' : null,
              product_feed_errors: i === 0 ? ['Failed!'] : null,
              product_feed_batch_id: i === 0 ? this.batch._id : null,
              inventory_feed_status: i === 1 ? 'HasErrors' : null,
              inventory_feed_errors: i === 1 ? ['Failed!'] : null,
              inventory_feed_batch_id: i === 1 ? this.batch._id : null,
            },
            plans:
              i === 0
                ? {
                    plans: [
                      {
                        id: 'FBA123456789',
                        fcid: 'FTW3',
                        prep: 'SELLER_LABEL',
                      },
                    ],
                  }
                : null,
          })
        );
      });
    });

    it('should display Pallet Utilization', function () {
      expect(
        rootContainer.querySelector('.batch-header .summary .cubic_utilization')
          .textContent
      ).to.be.equal('6.81% Pallet Utilization');
    });
  });

  describe('filter by shipment', () => {
    before(async function () {
      // Create test batch
      await act(
        async () =>
          (this.batch = await app.createBatch({
            ship_from: '1',
            marketplace: 'US',
            name: 'Test Batch Items',
          }))
      );

      // Load inventory info for given MSKUs
      await act(
        async () =>
          (this.inventory = await app.loadInventory({
            filters: {
              q: [
                'B001FOQJOG-076',
                '2013-04-19-B004CRYE2C-UA',
                '0553537865-PM',
                '2019-02-26-B01AXY5YD0-868',
              ],
            },
          }))
      );

      act(() => app.setState({ isWarehouse: true }));

      // Create the batch items
      await act(
        async () =>
          (this.batchItems = await app.createBatchItems(
            this.batch._id,
            this.inventory.data.map((inventory) => ({
              inventory,
              quantity: 2,
              buylist: [{ cost: 500 }],
            }))
          ))
      );

      // Load batch items
      act(() => app.setState({ currentBatch: this.batch._id }));
      await act(() => app.loadBatchItems(this.batch._id));

      // fake the update
      act(() => {
        app.updateBatchState(app.state.currentBatch, (b) => ({
          items: b.items.map((bi) => ({
            ...bi,
            shipments: [
              {
                id: 'FBA176HVG1RL',
                fcid: 'GYR2',
                quantity: 1,
                prep: 'SELLER_LABEL',
              },
            ],
            plans: {
              plans: [
                {
                  id: 'FBA176HVG1RL',
                  fcid: 'GYR2',
                  quantity: 1,
                  prep: 'SELLER_LABEL',
                },
              ],
            },
          })),
        }));
      });



    });
    
    it('verify color',()=>{
      expect(
        getComputedStyle(
          rootContainer.querySelector('.batch-item-filter-label'),
          null
        ).getPropertyValue('background-color')
      ).to.be.equal('gray');
      act(() =>
        Simulate.click(rootContainer.querySelector('.batch-item-filter-label'))
      );

      expect(
        getComputedStyle(
          rootContainer.querySelector('.batch-item-filter-label.selected'),
          null
        ).getPropertyValue('background-color')
      ).to.be.equal('var(--box-dark-blue)');

      expect(
        getComputedStyle(
          rootContainer.querySelector('.batch-item-filter-label.listed'),
          null
        ).getPropertyValue('background-color')
      ).to.be.equal('rgb(95, 173, 65)');

      act(() =>
        Simulate.click(rootContainer.querySelector('.batch-item-filter-label.listed'))
      );

      expect(
        getComputedStyle(
          rootContainer.querySelector(
            '.batch-item-filter-label.listed.selected::after'
          ),
          null
        ).getPropertyValue('background-color')
      ).to.be.equal(
        'linear-gradient(rgba(0, 0, 255, 0.5), rgba(0, 0, 255, 0.5)),linear-gradient(rgba(0, 255, 0, 0.5), rgba(0, 255, 0, 0.5))'
      );
    });
  });
});

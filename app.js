// Storage Controller
const StorageCtrl = (function() {
  // Public Methods
  return {
    storeItem: function(item) {
      let items;
      // CHeck if any items in LS
      if (localStorage.getItem("items") === null) {
        items = [];
        // Push new item
        items.push(item);
        // Set Ls
        localStorage.setItem("items", JSON.stringify(items));
      } else {
        // get what is already in LS
        items = JSON.parse(localStorage.getItem("items"));
        // Push new item
        items.push(item);
        // Re Set Ls
        localStorage.setItem("items", JSON.stringify(items));
      }
    },

    getItemsFromStorage: function(item) {
      let items;
      if (localStorage.getItem("items") === null) {
        items = [];
      } else {
        items = JSON.parse(localStorage.getItem("items"));
      }
      return items;
    },

    updateItemStorage: function(updateItem) {
      let items = JSON.parse(localStorage.getItem("items"));
      items.forEach(function(item, index) {
        if (updateItem.id === item.id) items.splice(index, 1, updateItem);
      });
      localStorage.setItem("items", JSON.stringify(items));
    },

    deleteItemFromStorage: function(id) {
      let items = JSON.parse(localStorage.getItem("items"));
      items.forEach(function(item, index) {
        if (item.id === id) {
          items.splice(index, 1);
        }
      });
      localStorage.setItem("items", JSON.stringify(items));
    },

    clearItemsFromStorage: function() {
      localStorage.removeItem("items");
    }
  };
})();

// Item Controller
const ItemCtrl = (function() {
  // Item Constructor
  const Item = function(id, name, calories) {
    this.id = id;
    this.name = name;
    this.calories = calories;
  };

  // Data Structure / State
  const data = {
    // items: [
    //   // { id: 0, name: "Steak Dinner", calories: 1200 },
    //   // { id: 1, name: "Cookie", calories: 400 },
    //   // { id: 2, name: "Eggs", calories: 300 }
    // ],
    items: StorageCtrl.getItemsFromStorage(),
    currentItem: null,
    totalCalories: 0
  };

  // Public methods
  return {
    getItems: function() {
      return data.items;
    },
    addItem: function(name, calories) {
      // Create ID
      let id;
      if (data.items.length > 0) {
        id = data.items[data.items.length - 1].id + 1;
      } else {
        id = 0;
      }

      // Calories to number
      calories = parseInt(calories);

      //  Create item
      newItem = new Item(id, name, calories);

      // Add to items array
      data.items.push(newItem);

      return newItem;
    },

    getItemById: function(id) {
      let found = null;
      // Loop through
      data.items.forEach(function(item) {
        if (item.id === id) {
          found = item;
        }
      });
      return found;
    },

    updateItem: function(name, calories) {
      // Calories to number
      calories = parseInt(calories);

      let found = null;

      data.items.forEach(function(item) {
        if (item.id === data.currentItem.id) {
          item.name = name;
          item.calories = calories;
          found = item;
        }
      });
      return found;
    },

    deleteItem: function(id) {
      // Get ids
      const ids = data.items.map(function(item) {
        return item.id;
      });

      // Get index
      const index = ids.indexOf(id);

      // Remove item
      data.items.splice(index, 1);
    },

    clearAllItems: function() {
      data.items = [];
    },

    setCurrentItem: function(item) {
      data.currentItem = item;
    },

    getCurrentItem: function() {
      return data.currentItem;
    },

    getTotalCalories: function() {
      let total = 0;

      // Loop through items and add cals
      data.items.forEach(function(item) {
        total += item.calories;
      });

      // Set total call in date structure
      data.totalCalories = total;

      // Return total
      return data.totalCalories;
    },

    logData: function() {
      return data;
    }
  };
})();

// UI Controller
const UICtrl = (function() {
  const UISelectors = {
    itemList: "#item-list",
    listItems: "#item-list li",
    addBtn: ".add-btn",
    updateBtn: ".update-btn",
    deleteBtn: ".delete-btn",
    backBtn: ".back-btn",
    clearBtn: ".clear-btn",
    itemNameInput: "#item-name",
    itemCaloriesInput: "#item-calories",
    totalCalories: ".total-calories"
  };

  // Public methods
  return {
    populateItemList: function(items) {
      let html = "";
      items.forEach(function(item) {
        html += `
        <li class="collection-item" id="item-${item.id}">
          <strong>${item.name}:</strong> <em>${item.calories} Calories</em>
          <a href="#" class="secondary-content">
            <i class="edit-item fa fa-pencil"></i>
          </a>
        </li>
        `;
      });

      // Insert list items
      document.querySelector(UISelectors.itemList).innerHTML = html;
    },

    getItemInput: function() {
      return {
        name: document.querySelector(UISelectors.itemNameInput).value,
        calories: document.querySelector(UISelectors.itemCaloriesInput).value
      };
    },

    addListItem: function(item) {
      // Show the list
      document.querySelector(UISelectors.itemList).style.display = "block";

      // Create li element
      const li = document.createElement("li");
      // Add class
      li.className = "collection-item";
      // Add Id
      li.id = `item-${item.id}`;

      // Add HTML
      li.innerHTML = `<strong>${item.name}:</strong> <em>${
        item.calories
      } Calories</em> <a href="#" class="secondary-content">
          <i class="edit-item fa fa-pencil"></i>
        </a>`;

      // Insert item
      document
        .querySelector(UISelectors.itemList)
        .insertAdjacentElement("beforeend", li);
    },

    updateListItem: function(item) {
      let listItems = document.querySelectorAll(UISelectors.listItems);

      // Turn node list into array
      listItems = Array.from(listItems);

      listItems.forEach(function(listItem) {
        const itemID = listItem.getAttribute("id");
        if (itemID === `item-${item.id}`) {
          document.querySelector(`#${itemID}`).innerHTML = `<strong>${
            item.name
          }: </strong> <em>${
            item.calories
          } Calories</em> <a href="#" class="secondary-content">
          <i class="edit-item fa fa-pencil"></i>
        </a>`;
        }
      });
    },

    // Delete list Item
    deleteListItem: function(id) {
      const itemId = `#item-${id}`;
      const item = document.querySelector(itemId);
      item.remove();
    },

    clearInput: function() {
      document.querySelector(UISelectors.itemNameInput).value = "";
      document.querySelector(UISelectors.itemCaloriesInput).value = "";
    },

    addItemtoForm: function() {
      document.querySelector(
        UISelectors.itemNameInput
      ).value = ItemCtrl.getCurrentItem().name;
      document.querySelector(
        UISelectors.itemCaloriesInput
      ).value = ItemCtrl.getCurrentItem().calories;
      UICtrl.showEditState();
    },

    removeItems: function() {
      let listItems = document.querySelectorAll(UISelectors.listItems);

      // Turn Node lost into array
      listItems = Array.from(listItems);

      listItems.forEach(function(item) {
        item.remove();
      });
    },

    hideList: function() {
      document.querySelector(UISelectors.itemList).style.display = "none";
    },

    showTotalCalories: function(total) {
      document.querySelector(UISelectors.totalCalories).textContent = total;
    },

    clearEditState: function() {
      UICtrl.clearInput();

      //Hide btns
      document.querySelector(UISelectors.updateBtn).style.display = "none";
      document.querySelector(UISelectors.deleteBtn).style.display = "none";
      document.querySelector(UISelectors.backBtn).style.display = "none";
      document.querySelector(UISelectors.addBtn).style.display = "inline";
    },
    showEditState: function() {
      // Show btns
      document.querySelector(UISelectors.updateBtn).style.display = "inline";
      document.querySelector(UISelectors.deleteBtn).style.display = "inline";
      document.querySelector(UISelectors.backBtn).style.display = "inline";
      document.querySelector(UISelectors.addBtn).style.display = "none";
    },

    getSelectors: function() {
      return UISelectors;
    }
  };
})();
// App Controller
const App = (function(ItemCtrl, UICtrl, StorageCtrl) {
  // Load event listeners
  const loadEventListeners = function() {
    // Get UI selectors
    const UISelectors = UICtrl.getSelectors();

    // Add item event
    document
      .querySelector(UISelectors.addBtn)
      .addEventListener("click", itemAddSubmit);

    // Disalble submit on enter
    document.addEventListener("keypress", function(e) {
      if (e.keyCode === 13 || e.which === 13) {
        e.preventDefault();
        return false;
      }
    });

    // Edit icon click event
    document
      .querySelector(UISelectors.itemList)
      .addEventListener("click", itemEditClick);

    // Update item event
    document
      .querySelector(UISelectors.updateBtn)
      .addEventListener("click", itemUpdateSubmit);

    // Back button event
    document
      .querySelector(UISelectors.backBtn)
      .addEventListener("click", UICtrl.clearEditState);

    // Delete button event
    document
      .querySelector(UISelectors.deleteBtn)
      .addEventListener("click", itemDeleteSubmit);

    // Clear button event
    document
      .querySelector(UISelectors.clearBtn)
      .addEventListener("click", UIclearAllItemsClick);
  };

  // Add item submit
  const itemAddSubmit = function(e) {
    // Get form input from UI Controler
    const input = UICtrl.getItemInput();

    // Check for name and calories
    if (input.name !== "" && input.calories !== "") {
      // Add item
      const newItem = ItemCtrl.addItem(input.name, input.calories);

      // Add item to UI list
      UICtrl.addListItem(newItem);

      // Get total calories
      const totalCalories = ItemCtrl.getTotalCalories();

      // Add total calories to UI
      UICtrl.showTotalCalories(totalCalories);

      // Store in local storage
      StorageCtrl.storeItem(newItem);

      // Clear fields
      UICtrl.clearInput();
    }

    e.preventDefault();
  };

  // Click edit item
  const itemEditClick = function(e) {
    if (e.target.classList.contains("edit-item")) {
      // Get list item id
      const listId = e.target.parentNode.parentNode.id;

      // Break into an array
      const listIdArray = listId.split("-");
      // Get the actual id
      const id = parseInt(listIdArray[1]);

      // Get item
      const itemToEdit = ItemCtrl.getItemById(id);

      // Set current item
      ItemCtrl.setCurrentItem(itemToEdit);

      // Add item to form
      UICtrl.addItemtoForm();
    }

    e.preventDefault();
  };

  // Item update Submit
  const itemUpdateSubmit = function(e) {
    // Get item input
    const input = UICtrl.getItemInput();

    // Update item
    const updateItem = ItemCtrl.updateItem(input.name, input.calories);

    // Update UI
    UICtrl.updateListItem(updateItem);

    // Get total calories
    const totalCalories = ItemCtrl.getTotalCalories();

    // Add total calories to UI
    UICtrl.showTotalCalories(totalCalories);

    // update Ls
    StorageCtrl.updateItemStorage(updateItem);

    UICtrl.clearEditState();

    e.preventDefault();
  };

  // Delete button event
  const itemDeleteSubmit = function(e) {
    // Get current item
    const currentItem = ItemCtrl.getCurrentItem();
    // Delete from data structure
    ItemCtrl.deleteItem(currentItem.id);

    // Delete from UI
    UICtrl.deleteListItem(currentItem.id);

    // Get total calories
    const totalCalories = ItemCtrl.getTotalCalories();

    // Add total calories to UI
    UICtrl.showTotalCalories(totalCalories);

    // Delete from LS
    StorageCtrl.deleteItemFromStorage(currentItem.id);

    UICtrl.clearEditState();

    e.preventDefault();
  };

  // Clear items event
  const UIclearAllItemsClick = function(e) {
    //Delete all items from data structure
    ItemCtrl.clearAllItems();

    // Get total calories
    const totalCalories = ItemCtrl.getTotalCalories();

    // Add total calories to UI
    UICtrl.showTotalCalories(totalCalories);

    UICtrl.clearEditState();

    e.preventDefault();

    // Remove from UI
    UICtrl.removeItems();

    // Clear LS
    StorageCtrl.clearItemsFromStorage();

    // Hide ul
    UICtrl.hideList();
  };

  // Public methods
  return {
    init: function() {
      // Clear edit state
      UICtrl.clearEditState();

      // Fetch Items from data structure
      const items = ItemCtrl.getItems();

      // Check if any items
      if (items.length === 0) {
        UICtrl.hideList();
      } else {
        // Populate list with items
        UICtrl.populateItemList(items);
      }

      // Get total calories
      const totalCalories = ItemCtrl.getTotalCalories();

      // Add total calories to UI
      UICtrl.showTotalCalories(totalCalories);

      // Load event listeners
      loadEventListeners();
    }
  };
})(ItemCtrl, UICtrl, StorageCtrl);

// Initialize App

App.init();

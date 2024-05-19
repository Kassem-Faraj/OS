/**********************************************************************************

Printer Queue project done by: Charly Salameh, Kassem Faraj, Ali Nassab, Rayen Kamel

*********************************************************************************/


// This array titled "queue" will store the requests in the queue
let queue = [];
// This request counter will be used to keep track of the order in which requests are added to the queue
let requestCounter = 0;

// Define fixed passwords for each user, where the key is the ID of each user, as well as the priority associated with the user
const passwords = {
  1: "admin123",
  2: "user123",
  3: "guest123"
};

// addToQuee function that adds request to que, by using event listeners to get the values of the input fields
const addToQueue =() =>{
  const userId = parseInt(document.getElementById('userId').value);
  const password = document.getElementById('password').value;
  const priority = parseInt(document.getElementById('priority').value);


  // Throws an error to the user if all input fields are not inputted
  if (!userId || !password || isNaN(priority)) {
    document.getElementById('warning').innerText = 'Please fill in all fields.';
    return;
  }

  // An error is displayed if a user inputs a user ID that doesnt exist(only 1, 2, 3)
  if (!(userId in passwords)) {
    document.getElementById('warning').innerText = 'User does not exist.';
    return;
  }

  // Checks if the inputted password is correct relative to the user ID
  if (passwords[userId] !== password) {
    document.getElementById('warning').innerText = 'Incorrect password.';
    return;
  }

  // This error is displayed when a range outside <0 or >10 is inputted
  if (priority < 0 || priority > 10) {
    document.getElementById('warning').innerText = 'Priority must be between 0 and 10.';
    return;
  }

  // If the above conditions are fixed, then we use DOM manipulation to remove the error message, by setting
  // the location of the warning back to an empty string
  document.getElementById('warning').innerText = '';

  const request = { userId, priority, order: requestCounter++ };

  // Whatever request was inputted by the user, we simply add it (or in this case push it) into the array
  queue.push(request);

  // When a request is added to the queue, the queue list is updated
  updateQueueList();
}

const executePrint = () => {
  // If a user tries to press the execute button that has 0 items, a warning message will be printed
  // === is used to ensure that its a 0 as an int, and not as a string
  if (queue.length === 0) {
    document.getElementById('warning').innerText = 'Queue is empty. Please add requests to the queue.';
    return;
  }

    // If an item has been added, the hint message to add requested is removed

  document.getElementById('warning').innerText = '';

  // If an item has been added, the hint message to add requested is removed
  document.getElementById('executedList').innerHTML = '';

  //...queue created a copy of the queue in which we will re-arrange the ordering of the queue
  // sort.((a, b) => {}) is for sorting, where a and b are the two elements being compared for sorting

  const sortedQueue = [...queue].sort((a, b) => {
    // If the input by the user was set o have a priority of 0, then the order of queue will follow the initial FIFO order
    if (a.priority === 0 && b.priority === 0) {
      return a.order - b.order;
    }
    if (a.priority === 0) return 1; // Priority 0 goes last
    if (b.priority === 0) return -1; // Priority 0 goes last

    // This condition will sort the queue by user ID, meaning it takes the user ID of the request and sorts it in ascending order
    if (a.userId !== b.userId) {
      // this subtracts the user ID of the two requests being compared, which makes a.userId - b.userId to sort in ascending order
      return a.userId - b.userId; // Sort by user ID
    }

    // Sort by priority (10 highest, 1 lowest)
    return b.priority - a.priority; 
  });

  // Whenever the execute button is pressed, the queue list is updated. Delays are added for better visualization and demonstrating the order of execution
  let delay = 0;

  // Loop through each item inside the queue
  sortedQueue.forEach((request, index) => {
    setTimeout(() => {
      const queueList = document.getElementById('queueList');
      const executedList = document.getElementById('executedList');
      
      // Every inputted request, that is matched with the currently executing sorted request, will be highlighted in green
      queue.forEach((req, idx) => {
        const listItem = queueList.children[idx];
        if (req === request) {
          listItem.classList.add('green');
        } else {
          listItem.classList.remove('green');
        }
      });

      // Basic DOM manipulation that creates a div element, when executing a queue, to the sorted queue of executions
      const executedItem = document.createElement('div');
      executedItem.classList.add('executed-item');
      executedItem.textContent = `Executed Request: User ID of ${request.userId} | Priority = ${request.priority}`;
      executedList.appendChild(executedItem);

      // If the index of the sorted queue is the last item (value of -1 based on length), then the green highlight will be removed from the queue
      if (index === sortedQueue.length - 1) {
        setTimeout(() => {
          queue.forEach((req, idx) => {
            queueList.children[idx].classList.remove('green');
          });
        }, 2000);

        // At the end of executions, the queue is cleared so the user can make new requests
        queue = [];
        updateQueueList();
      }
    }, delay);
    // Set a 4 second interval for each request to be executed
    delay += 4000;
  });
}

// Function created to be called inorder to make the coorect updates such as clearing the queue,
// Adding/remove hint text
const updateQueueList = () => {
  const queueList = document.getElementById('queueList');
  queueList.innerHTML = '';

  // If the queue is empty, then display a hint message of "no items in the queue"
  if (queue.length === 0) {
    queueList.textContent = 'No items in the queue.';
    // If the queue is not empty, select the queue div, and append each user input with the proper user ID and priority information
  } else {
    queue.forEach((request, index) => {
      const listItem = document.createElement('div');
      listItem.classList.add('queue-item');
      listItem.textContent = `Request ${index + 1}: User ID of ${request.userId} | Priority = ${request.priority}`;
      // AppendChild, simply appends the user input to the queue HTML div
      queueList.appendChild(listItem);
    });
  }

  // In the above code, when the queue is being executed the items in the execution will be added to the executedList,
  // So if there are 0 items to be executed, simply display a message to execute the queue to view executed requests
  const executedList = document.getElementById('executedList');
  if (executedList.childElementCount === 0) {
    executedList.textContent = 'Execute the queue to view executed requests.';
  }
}
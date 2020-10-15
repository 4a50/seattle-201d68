`use strict`
// global variables

var imageOneElement = document.getElementById('imageOneElement');
var imageTwoElement = document.getElementById('imageTwoElement');
var imageThreeElement = document.getElementById('imageThreeElement');
var voteCount = [];
var voteSeen = [];
var titles = [];
var imageArray = [];
var onlyThreeImages = [imageOneElement, imageTwoElement, imageThreeElement];
var onlyOnceArray = [];
var previousImages = [];
var calculateClicks = 0;
var imageList = document.getElementById('image-container');
var ctx = document.getElementById('myChart').getContext('2d');


// lets check to see if this is the first time the user has been to this site
  // lets see if there is something in LS
if(!localStorage.getItem('products')){
  constructorItemList();
}

// console.log(localStorage.getItem('products'));

// image constructor

function RecentRandomItems(src, name) {
  this.src = src;
  this.alt = name;
  this.title = name;
  this.seen = 0;
  this.clicked = 0;

  titles.push(name);
  imageArray.push(this);

}

// bar chart data

function displayChart() {

  var myChart = new Chart(ctx, {
    type: 'Bar',
    data: {
      labels: titles, // products go here
      datasets: [{
        label: 'Number of Votes',
        data: voteCount, // number of votes
        backgroundColor: [
          'rgba(255, 255, 255, 0.2)',
          'rgba(54, 162, 235, 0.2)',
          'rgba(255, 206, 86, 0.2)',
          'rgba(75, 192, 192, 0.2)',
          'rgba(153, 102, 255, 0.2)',
          'rgba(255, 159, 64, 0.2)'
        ],
        borderColor: [
          'rgba(44, 44, 44, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
          'rgba(255, 159, 64, 1)'
        ],
        borderWidth: 6
      },
      {
        label: 'Number of Views',
        data: voteSeen,
        backgroundColor: [
          'rgba(255, 255, 255, 0.2)',
          'rgba(54, 162, 235, 0.2)',
          'rgba(255, 206, 86, 0.2)',
          'rgba(75, 192, 192, 0.2)',
          'rgba(153, 102, 255, 0.2)',
          'rgba(255, 159, 64, 0.2)'
        ],
        borderColor: [
          'rgba(44, 44, 44, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
          'rgba(255, 159, 64, 1)'
        ],
        borderWidth: 6
      }]
    }
  });
}

// helper functions- random generator and unique images from random images

function getRandomNumber(max) {
  return Math.floor(Math.random() * (max));
}

// picks three random images
function specialThreeImages() {
  var randomImageIndex = getRandomNumber(imageArray.length);
  var selectedImages = [];
  for (var i = 0; i < 3; i++) {


    while (onlyOnceArray.includes(randomImageIndex)) {
      var randomImageIndex = getRandomNumber(imageArray.length);
    }
    onlyOnceArray.push(randomImageIndex);
    selectedImages.push(randomImageIndex);
  }
  if (onlyOnceArray.length > 5) {
    onlyOnceArray.shift();
  }
  return selectedImages;
}
// for removing items we already chose
function removeItems() {
  for (var i = 0; i < 3; i++) {
    onlyOnceArray.shift();
  }
}
// generates random images in a unique manner
function getItems() {
  var selectedImages = specialThreeImages();
  console.log(selectedImages);
  for (var i = 0; i < onlyThreeImages.length; i++) {
    onlyThreeImages[i].src = imageArray[selectedImages[i]].src;
    onlyThreeImages[i].alt = imageArray[selectedImages[i]].alt;
    onlyThreeImages[i].title = imageArray[selectedImages[i]].title;
    imageArray[selectedImages[i]].seen++;
  }
}

// event listener for clicks

function handleClick(event) {
  var votedOn = event.target.title;
  calculateClicks++;

  for (var i = 0; i < imageArray.length; i++) {
    if (votedOn === imageArray[i].title) {
      imageArray[i].clicked++
    }
  }
  // console.log('in handle click');
  totalClicksDone();
}

//add data to graph-stores them in local storage to keep a log

function results() {
  for (var i = 0; i < imageArray.length; i++) {
    voteCount.push(imageArray[i].clicked);
    voteSeen.push(imageArray[i].seen)
  }
}

// things to go in local storage: array of titles= titles, and array of total votes per title=votesArray

// function storeInLocalStorage(titles, votesArray, seenArray) {
//   // iterate object to store
//   var votesByTitle = {
//     title: titles,
//     votes: votesArray,
//     seen: seenArray,
//   };
//   // use stringify to move objects from votesByTitle to new variable string to be saved in local storage

//   var votesByTitleString = JSON.stringify(votesByTitle);

//   //this sets the objects from the new string votesbytitlestring into local storage

//   localStorage.setItem('vote-data', votesByTitleString);
// }

//populate bar and reduce clicks to 25 max

function totalClicksDone() {
  console.log('calculate clicks', calculateClicks);
  if (calculateClicks === 25) {

    // imageList.removeEventListener('click', handleClick);
    // it works here but why?
    chartResults();

    var stringifedProducts = JSON.stringify(imageArray);
    localStorage.setItem('products', stringifedProducts);




    // if (dataInLocalStorage) {
    //   var parseVotes = JSON.parse(dataInLocalStorage);
    //   // console.log('old voteCount: ', voteCount);
    //   // this for loop increments the voteCount at each index to include local storage data. loops through both, bonding them together, so to speak 
    //   for (var i = 0; i < parseVotes.title.length; i++) {
    //     voteCount[i] += parseVotes.votes[i];
    //     voteSeen[i] += parseVotes.seen[i];
    //   }
    //   // console.log('new voteCount: ', voteCount);
    //   // time to store updated array into local storage. 
    //   storeInLocalStorage(titles, voteCount, voteSeen);
    // } else {
    //   // this is in case the local storage is empty
    //   storeInLocalStorage(titles, voteCount, voteSeen);
    // }
    // call function to display chart now that we have all the information in the local storage
    displayChart();

    // this else is in case we have not reached the 25 clicks yet, I wonder if this is a good place to put it? call the functions to remove, and add images from previous work. YAY FUNCTIONS! 

  } else {
    // removeItems();
    getItems();
  }
}

// putting image instantiation here, as advised..

function constructorItemList() {
  new RecentRandomItems('img/bag.jpg', 'bag');
  new RecentRandomItems('img/banana.jpg', 'banana');
  new RecentRandomItems('img/bathroom.jpg', 'bathroom');
  new RecentRandomItems('img/boots.jpg', 'boots');
  new RecentRandomItems('img/breakfast.jpg', 'breakfast');
  new RecentRandomItems('img/bubblegum.jpg', 'bubblegum');
  new RecentRandomItems('img/chair.jpg', 'chair');
  new RecentRandomItems('img/cthulhu.jpg', 'cthulhu');
  new RecentRandomItems('img/dog-duck.jpg', 'dog-duck');
  new RecentRandomItems('img/dragon.jpg', 'dragon');
  new RecentRandomItems('img/pen.jpg', 'pen');
  new RecentRandomItems('img/pet-sweep.jpg', 'pet-sweep');
  new RecentRandomItems('img/scissors.jpg', 'scissors');
  new RecentRandomItems('img/shark.jpg', 'shark');
  new RecentRandomItems('img/sweep.png', 'sweep');
  new RecentRandomItems('img/tauntaun.jpg', 'tauntaun');
  new RecentRandomItems('img/unicorn.jpg', 'unicorn');
  new RecentRandomItems('img/usb.gif', 'usb');
  new RecentRandomItems('img/water-can.jpg', 'water-can');
  new RecentRandomItems('img/wine-glass.jpg', 'wine-glass');
}

// render the and maybe add to constructor...
imageList.addEventListener('click', handleClick);

// executable code
// constructorItemList();
getItems();
console.log('completed program');
// why do I see the constructor objects in their own function? lets see!
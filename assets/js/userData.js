/**
 * @author Francis Olawumi Awe
 * @description This page function control the display of user post and user list
 */
/**
 * @var {HTMLCanvasElement} closeIcon - used to close post modal for user
 */
var closeIcon = document.getElementById("close-icon");
/**
 * @var {HTMLCanvasElement} userPost - used to check if userPost is open or not and used to set it to new property
 */
var userPostDisplay = document.getElementById("post-modal");
/**
 * @var {HTMLCanvasElement} displayUsersTable- used to check if userList table is open or not and used to set it to new property
 */
var displayUsersTable = document.getElementById("user-list");
/**
 * @var {HTMLCanvasElement} userInfoName - used to set Post header user name
 */
var userInfoName = document.getElementById("user-info-name");
/**
 * @var {HTMLCanvasElement} userInfoEmail - used to set Post header user email
 */
var userInfoEmail = document.getElementById("user-info-email");

/**
 * @method {void} closeUserPosts - This closes the Post modal when close icon is click
 */
const closeUserPosts = () => {
  userPostDisplay.style.display = "none";
  displayUsersTable.style.display = "block";
};

/**
 * @method {void} openUserPosts - This open the Post modal when any of the user name is click
 */
const openUserPosts = () => {
  // check if display is true
  displayUsersTable.style.display = "none";
  userPostDisplay.style.display = "block";
};

/**
 * load the table when the page is loaded
 */
window.addEventListener("load", displayUserListInTable);

/**
 * listen to click event on close icon and call close function
 */
closeIcon.addEventListener("click", closeUserPosts);

/**
 * @var userUrl - api url for getting user data
 */
var userUrl = "https://jsonplaceholder.typicode.com/users";

/**
 * @var postUrl - api url for getting user post data
 */
var postUrl = "https://jsonplaceholder.typicode.com/posts";

/**
 * @method {void} displayUserListInTable
 * @description -  This method get user daya and display each user information in each row in a table
 */
async function displayUserListInTable() {
  let response = await fetch(userUrl);
  let userList = await response.json();

  // display each user data using map
  userList.map((data) => {
    // create element to set each user data in each row
    let tr = document.createElement("tr");
    tr.id = data.id;
    let td = `<td onclick="showUserPosts(${data.id})">${data.name}</td> <td>${
      data.username
    }</td><td>${data.email}</td> <td>${
      data.address.street +
      " " +
      data.address.suite +
      " " +
      data.address.city +
      " " +
      data.address.zipcode +
      " " +
      data.address.geo.lng +
      " " +
      data.address.geo.lat
    }</td><td>${data.phone}</td> <td>${data.website}</td> <td>${
      data.company.name
    }</td> `;
    
    // insert the html variable into the new element and append each one
    tr.innerHTML = td;

    document.getElementById("table-data").append(tr);
  });
}

/**
 * @method {object} loadUserPost
 * @description - This method is a closure method. it fetches all user data and use the inner method to get post specific to each user
 */
async function loadUserPost() {
  let response = await fetch(postUrl);
  var data = await response.json();
  userPost = function (userId) {
    // filter out only data peculiar to the id provided
    return data.filter((data) => (userId == data.userId ? data.userId : null));
  };
  return userPost;
}

/**
 * @method {void} showUserPosts 
 * @description - This method display the user post modal
 * @param {any} userId - this param is set during display of the user data in table
 */

async function showUserPosts(userId) {
  openUserPosts();
  var userPosts = await loadUserPost();
  var posts = userPosts(userId);

  var name = document.getElementById(userId).childNodes[0].textContent;
  var userName = document.getElementById(userId).childNodes[2].textContent;
  var userEmail = document.getElementById(userId).childNodes[3].textContent;

  userInfoName.innerHTML = name;
  userInfoEmail.innerHTML = userEmail;

  document.getElementById("posts").innerHTML = " ";

  posts.map((post) => {
    postContent = document.createElement("div");
    postDetails = `
    <button class="post-caption" onclick="togglePostDetails('d'+${post.id})"> ${post.title} </button>
    <div class="user-post-details" id="d${post.id}">
        <div class="post-head">
            <div>Username: <i>${userName}</i> </div><span class="post-date">20:08 pm</span>
        </div>
        <div class="post-body"><h3>Post Message</h3> ${post.body}</div>

    </div>
    `;
    postContent.innerHTML = postDetails;
    document.getElementById("posts").append(postContent);
  });
}

/**
 * @method {void} togglePostDetails - This method toggle the display of each post and makes it to act like an accordion
 * @param {string} id - this id is set when the user posts were display
 */
function togglePostDetails(id) {
  var postDetail = document.getElementById(id);
  postDetail.classList.toggle("user-post-details-active");
}

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBiahfJ3hNk_wqX9hy3PdE7eNPZrHgR_uM",
  authDomain: "file-upload-app-d299b.firebaseapp.com",
  projectId: "file-upload-app-d299b",
  storageBucket: "file-upload-app-d299b",
  messagingSenderId: "10641864620",
  appId: "1:10641864620:web:373b7da6a0612e563dac09",
  measurementId: "G-HDHBNKTBV6",
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

let currentParentID = null;

// Show sections
function showSection(section) {
  document.querySelectorAll(".section").forEach((sec) => {
    sec.classList.remove("active");
  });
  document.getElementById(section).classList.add("active");
  if (section === "home") {
    loadFolders(false);
  } else if (section === "deleted") {
    loadFolders(true);
  }
}

// Load folders
async function loadFolders(isDeleted) {
  const folderList = isDeleted
    ? document.getElementById("deleted-list")
    : document.getElementById("folder-list");

  folderList.innerHTML = "Loading...";
  const folders = await db
    .collection("folders")
    .where("parentID", "==", currentParentID)
    .where("isDeleted", "==", isDeleted)
    .get();

  if (folders.empty) {
    folderList.innerHTML = "<p>No folders found.</p>";
    return;
  }

  folderList.innerHTML = "";
  folders.forEach((doc) => {
    const folder = doc.data();
    const folderDiv = document.createElement("div");
    folderDiv.className = "folder-item";
    folderDiv.innerHTML = `
      <span>${folder.name}</span>
      <button onclick="deleteFolder('${doc.id}', ${isDeleted})">${
      isDeleted ? "Restore" : "Delete"
    }</button>
    `;
    folderList.appendChild(folderDiv);
  });
}

// Create folder modal
function createFolder() {
  document.getElementById("modal").classList.remove("hidden");
}

function closeModal() {
  document.getElementById("modal").classList.add("hidden");
}

// Save folder
async function saveFolder() {
  const folderName = document.getElementById("folder-name").value;
  if (!folderName) {
    alert("Folder name cannot be empty.");
    return;
  }

  await db.collection("folders").add({
    name: folderName,
    parentID: currentParentID,
    isDeleted: false,
  });

  closeModal();
  loadFolders(false);
}

// Delete folder
async function deleteFolder(folderID, isDeleted) {
  await db.collection("folders").doc(folderID).update({
    isDeleted: !isDeleted,
  });
  loadFolders(isDeleted);
}

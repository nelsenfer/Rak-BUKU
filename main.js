const books = [];
const RENDER_EVENT = "render-book";
const SAVED_EVENT = "saved-book";
const STORAGE_KEY = "BOOK_APPS";

function generateId() {
  return +new Date();
}

document.addEventListener("DOMContentLoaded", function () {
  const submitForm = document.getElementById("bookForm");
  submitForm.addEventListener("submit", function (event) {
    event.preventDefault();
    addBook();
  });
  if (isStorageExist()) {
    loadDataFromStorage();
  }
});

function addBook() {
  const bookTitle = document.getElementById("bookFormTitle").value;
  const bookAuthor = document.getElementById("bookFormAuthor").value;
  const bookYear = parseInt(document.getElementById("bookFormYear").value);
  const bookChecked = document.getElementById("bookFormIsComplete").checked;
  const generateID = generateId();

  const bookObject = generateBookObject(
    generateID,
    bookTitle,
    bookAuthor,
    bookYear,
    bookChecked
  );
  books.push(bookObject);
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function generateBookObject(id, title, author, year, isComplete) {
  return {
    id,
    title,
    author,
    year,
    isComplete,
  };
}

document.addEventListener(RENDER_EVENT, function () {
  console.log(books);
  const incompletedBOOKList = document.getElementById("incompleteBookList");
  incompletedBOOKList.innerHTML = "";

  const completedBOOKList = document.getElementById("completeBookList");
  completedBOOKList.innerHTML = "";

  for (const bookItem of books) {
    const bookElement = makeBookShelf(bookItem);
    if (!bookItem.isComplete) {
      incompletedBOOKList.append(bookElement);
    } else {
      completedBOOKList.append(bookElement);
    }
  }
});

function makeBookShelf(bookObject) {
  const textTitle = document.createElement("h3");
  textTitle.setAttribute("data-testid", "bookItemTitle");
  textTitle.classList.add("book-title");
  textTitle.innerText = bookObject.title;

  const textAuthor = document.createElement("p");
  textAuthor.setAttribute("data-testid", "bookItemAuthor");
  textAuthor.innerText = "Penulis: " + bookObject.author;

  const textYear = document.createElement("p");
  textYear.setAttribute("data-testid", "bookItemYear");
  textYear.innerText = "Tahun: " + bookObject.year;

  const textContainer = document.createElement("div");
  textContainer.classList.add("subContainer");
  textContainer.append(textTitle, textAuthor, textYear);

  const container = document.createElement("div");
  container.setAttribute("data-testid", "bookItem");
  container.append(textContainer);
  container.setAttribute("data-bookid", bookObject.id);

  if (bookObject.isComplete) {
    const undoButton = document.createElement("button");
    undoButton.setAttribute("data-testid", "bookItemIsCompleteButton");
    undoButton.innerText = "undo";
    undoButton.classList.add("undo-button");
    undoButton.addEventListener("click", function () {
      undoBookFromCompleted(bookObject.id);
    });

    const trashButton = document.createElement("button");
    trashButton.setAttribute("data-testid", "bookItemDeleteButton");
    trashButton.innerText = "hapus";
    trashButton.classList.add("trash-button");
    trashButton.addEventListener("click", function () {
      TremoveBookFromCompletedarget(bookObject.id);
    });

    container.append(undoButton, trashButton);
  } else {
    const checkButton = document.createElement("button");
    checkButton.setAttribute("data-testid", "bookItemIsCompleteButton");
    checkButton.innerText = "check";
    checkButton.classList.add("check-button");

    checkButton.addEventListener("click", function () {
      addTaskToCompleted(bookObject.id);
    });

    const trashButton = document.createElement("button");
    trashButton.setAttribute("data-testid", "bookItemDeleteButton");
    trashButton.innerText = "hapus";
    trashButton.classList.add("trash-button");
    trashButton.addEventListener("click", function () {
      TremoveBookFromCompletedarget(bookObject.id);
    });

    container.append(checkButton, trashButton);
  }
  return container;
}

function findBook(bookId) {
  for (const BookItem of books) {
    if (BookItem.id === bookId) {
      return BookItem;
    }
  }
  return null;
}

function findBookIndex(bookId) {
  for (const index in books) {
    if (books[index].id === bookId) {
      return index;
    }
  }

  return -1;
}

function addTaskToCompleted(bookId) {
  const bookTarget = findBook(bookId);

  if (bookTarget == null) return;

  bookTarget.isComplete = true;
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function TremoveBookFromCompletedarget(bookId) {
  const bookTarget = findBookIndex(bookId);
  if (bookTarget === -1) return;

  books.splice(bookTarget, 1);
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function undoBookFromCompleted(bookId) {
  const bookTarget = findBook(bookId);

  if (bookTarget == null) return;

  bookTarget.isComplete = false;
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function saveData() {
  if (isStorageExist()) {
    const parsed = JSON.stringify(books);
    localStorage.setItem(STORAGE_KEY, parsed);
    document.dispatchEvent(new Event(SAVED_EVENT));
  }
}

function isStorageExist() {
  if (typeof Storage === undefined) {
    alert("Browser kamu tidak mendukung local storage");
    return false;
  }
  return true;
}

function loadDataFromStorage() {
  const serializedData = localStorage.getItem(STORAGE_KEY);
  let data = JSON.parse(serializedData);

  if (data !== null) {
    for (const book of data) {
      books.push(book);
    }
  }

  document.dispatchEvent(new Event(RENDER_EVENT));
}

const searchBookForm = document.getElementById("searchBook");
searchBookForm.addEventListener("submit", function (event) {
  event.preventDefault();
  searchBook();
});

function searchBook() {
  const inputSearchTitle = document
    .getElementById("searchBookTitle")
    .value.toLowerCase();
  const bookTitles = document.querySelectorAll(".subContainer");
  for (const titles of bookTitles) {
    if (titles.textContent.toLowerCase().includes(inputSearchTitle)) {
      titles.parentElement.style.display = "block";
    } else {
      titles.parentElement.style.display = "none";
    }
  }
}

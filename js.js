const books = [];
const RENDER_EVENT = "render-book";

document.addEventListener("DOMContentLoaded", function () {
  const bookFormSubmit = document.getElementById("bookForm");
  bookFormSubmit.addEventListener("submit", function (event) {
    event.preventDefault();
    addBook();
  });

  //   membuat fungsi addBook yang berfungsi menambahkan buku
  function addBook() {
    const bookFormTitle = document.getElementById("bookFormTitle").value;
    const bookFormAuthor = document.getElementById("bookFormAuthor").value;
    const bookFormYear = Number(document.getElementById("bookFormYear").value);
    const bookChecked = document.getElementById("bookFormIsComplete").checked;

    const generatedID = generateId();
    const bookObject = generateBookObject(
      generatedID,
      bookFormTitle,
      bookFormAuthor,
      bookFormYear,
      bookChecked
    );
    books.push(bookObject);

    document.dispatchEvent(new Event(RENDER_EVENT));
    saveBook();
  }

  //   membuat fungsi generatedID yang berguna untuk men-generated ID unik tiap buku
  function generateId() {
    return +new Date();
  }

  //   membuat fungsi generateBookObject yang berguna untuk men-generate title, author, & year tiap buku
  function generateBookObject(id, title, author, year, isComplete) {
    return {
      id,
      title,
      author,
      year,
      isComplete,
    };
  }

  // membuat fungsi makeBook yang digunakan untuk menampilkan item buku
  function makeBook(bookObject) {
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
    container.classList.add("incompleteBookItem");
    container.append(textContainer);
    container.setAttribute("id" + bookObject.id);

    if (bookObject.isComplete) {
      container.setAttribute("data-bookid", "456456456");
      const trashButton = document.createElement("button");
      trashButton.classList.add("button-2");
      trashButton.innerText = "Hapus buku";

      trashButton.addEventListener("click", function () {
        deleteBookFromCompleted(bookObject.id);
      });

      const editButton = document.createElement("button");
      editButton.classList.add("button-3");
      editButton.innerText = "Edit buku";

      const buttonItem = document.createElement("div");
      buttonItem.classList.add("button-item");
      buttonItem.append(trashButton, editButton);

      container.append(buttonItem);
    } else {
      container.setAttribute("data-bookid", "123123123");
      const removeButton = document.createElement("button");
      removeButton.classList.add("button-1");
      removeButton.innerText = "Selesai baca";

      removeButton.addEventListener("click", function () {
        addBookToCompleted(bookObject.id);
      });

      const editButton = document.createElement("button");
      editButton.classList.add("button-3");
      editButton.innerText = "Edit buku";

      const buttonItem = document.createElement("div");
      buttonItem.classList.add("button-item");
      buttonItem.append(removeButton, editButton);

      container.append(buttonItem);
    }

    return container;
  }

  // membuat fungsi addBookToComplete
  function addBookToCompleted(bookId) {
    const bookTarget = findBook(bookId);

    if (bookTarget == null) return;

    bookTarget.isComplete = true;
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveBook();
  }

  // membuat fungsi deleteBookFromCompleted
  function deleteBookFromCompleted(bookId) {
    const bookTarget = findBookIndex(bookId);

    if (bookTarget === -1) return;

    books.splice(bookTarget, 1);
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveBook();
  }

  // membuat fungsi findBook
  function findBook(bookId) {
    for (const bookItem of books) {
      if (bookItem.id == bookId) {
        return bookItem;
      }
    }
    return null;
  }

  // membuat fungsi findBookIndex
  function findBookIndex(bookId) {
    for (const index in books) {
      if (books[index].id === bookId) {
        return index;
      }
    }

    return -1;
  }

  document.addEventListener(RENDER_EVENT, function () {
    const incompleteBookList = document.getElementById("incompleteBookList");
    incompleteBookList.innerHTML = "";

    const completeBookList = document.getElementById("completeBookList");
    completeBookList.innerHTML = "";

    for (const bookItem of books) {
      const bookElement = makeBook(bookItem);
      if (!bookItem.isComplete) incompleteBookList.append(bookElement);
      else completeBookList.append(bookElement);
    }
  });

  // variabel untuk menyimpan data ke local storage
  const SAVED_EVENT = "save-book";
  const STORAGE_KEY = "book-apps";

  function isStorageExist() {
    if (typeof Storage === undefined) {
      alert("browser kamu tidak mendukung local storage");
      return false;
    }
    return true;
  }

  // membuat function saveBook yang digunakan untuk menyimpan data di local storage
  function saveBook() {
    if (isStorageExist()) {
      const parsed = JSON.stringify(books);
      localStorage.setItem(STORAGE_KEY, parsed);
      document.dispatchEvent(new Event(SAVED_EVENT));
    }
  }

  document.addEventListener(SAVED_EVENT, function () {
    console.log(localStorage.getItem(STORAGE_KEY));
  });

  // membuat function loadBookFromStorage untuk menampilkan data buku yang telah disimpan di local storage
  function loadBookFromStorage() {
    const dataBook = localStorage.getItem(STORAGE_KEY);
    let data = JSON.parse(dataBook);
    if (data !== null) {
      for (const book of data) {
        books.push(book);
      }
    }

    document.dispatchEvent(new Event(RENDER_EVENT));
  }

  if (isStorageExist()) {
    loadBookFromStorage();
  }

  // membuat function searcBookItem
  const searchBookForm = document.getElementById("searchBook");
  searchBookForm.addEventListener("submit", function (event) {
    event.preventDefault();
    searchBook();
  });

  function searchBook() {
    const inputSearchTitle = document
      .getElementById("searchBookTitle")
      .value.toLowerCase();
    const bookTitles = document.querySelectorAll(".book-title");
    for (const titles of bookTitles) {
      if (titles.textContent.toLowerCase().includes(inputSearchTitle)) {
        titles.parentElement.parentElement.style.display = "block";
      } else {
        titles.parentElement.parentElement.style.display = "none";
      }
    }
  }
});

document.addEventListener("DOMContentLoaded", () => {
    const section = document.querySelector("section");
    const form = document.querySelector("form");

    form.addEventListener("submit", e => {
        e.preventDefault();

        const todoText = form.elements[0].value;
        const todoYear = form.elements[1].value;
        const todoMonth = form.elements[2].value;
        const todoDate = form.elements[3].value;

        if (!todoText || !todoYear || !todoMonth || !todoDate) {
            alert("請完整輸入資訊");
            return;
        }

        const todo = createTodoElement(todoText, todoYear, todoMonth, todoDate);
        saveTodoToLocalStorage(todoText, todoYear, todoMonth, todoDate);

        // 清空表單
        form.reset();

        // 重新加載並排序 Todo 項目
        loadAndRenderTodos();
    });

    // 加載本地存儲中的 Todo 項目
    loadAndRenderTodos();
});

function createTodoElement(todoText, todoYear, todoMonth, todoDate) {
    const todo = document.createElement("div");
    todo.classList.add("todo");

    const text = document.createElement("p");
    text.classList.add("todo-text");
    text.innerText = todoText;

    const time = document.createElement("p");
    time.classList.add("todo-time");
    time.innerText = `${todoYear}/${todoMonth}/${todoDate}`;

    todo.appendChild(text);
    todo.appendChild(time);

    const completeButton = document.createElement("button");
    completeButton.classList.add("complete");
    completeButton.innerHTML = '<i class="fa-regular fa-paper-plane"></i>';

    completeButton.addEventListener("click", () => {
        todo.classList.toggle("done");
    });

    const trashButton = document.createElement("button");
    trashButton.classList.add("trash");
    trashButton.innerHTML = '<i class="fa-solid fa-recycle"></i>';

    trashButton.addEventListener("click", () => {
        todo.addEventListener("animationend", () => {
            todo.remove();
            removeTodoFromLocalStorage(todoText);
        });
        todo.style.animation = "scaleDown 0.3s forwards";
    });

    todo.appendChild(completeButton);
    todo.appendChild(trashButton);

    todo.style.animation = "scaleUp 0.3s forwards";

    return todo;
}

function saveTodoToLocalStorage(todoText, todoYear, todoMonth, todoDate) {
    const myTodo = {
        todoText,
        todoYear,
        todoMonth,
        todoDate
    };

    let myList = localStorage.getItem("list");
    if (myList === null) {
        localStorage.setItem("list", JSON.stringify([myTodo]));
    } else {
        let myListArray = JSON.parse(myList);
        myListArray.push(myTodo);
        localStorage.setItem("list", JSON.stringify(myListArray));
    }
}

function loadAndRenderTodos() {
    const section = document.querySelector("section");
    section.innerHTML = '<div class="sort"><button>新增後自動依日期排序</button></div>'; // 清空 section 並保留排序按鈕

    let myList = localStorage.getItem("list");
    if (myList !== null) {
        let myListArray = JSON.parse(myList);

        // 根據日期排序
        myListArray.sort((a, b) => {
            const dateA = new Date(a.todoYear, a.todoMonth - 1, a.todoDate);
            const dateB = new Date(b.todoYear, b.todoMonth - 1, b.todoDate);
            return dateA - dateB;
        });

        myListArray.forEach(item => {
            const todo = createTodoElement(item.todoText, item.todoYear, item.todoMonth, item.todoDate);
            section.appendChild(todo);
        });
    }
}

function removeTodoFromLocalStorage(todoText) {
    let myList = localStorage.getItem("list");
    if (myList !== null) {
        let myListArray = JSON.parse(myList);
        myListArray = myListArray.filter(item => item.todoText !== todoText);
        localStorage.setItem("list", JSON.stringify(myListArray));
    }
}

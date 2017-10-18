// У View методы разбиты на две части первое это обработчики событий они посути будут вызывать методы Контроллера далее К
// онтроллер общается с моделью получает от нее данные и передает ее обратно представлению где уже срабатывает вторая часть методов которые манипулируют DOM

import { createElement, EventEmitter } from './helpers.js';

class View extends EventEmitter {
  constructor(model) {
    super();

    this.form = document.querySelector('#todo-form');
    this.input = document.querySelector('#add-input');
    this.list = document.querySelector('#todo-list');

    this.form.addEventListener('submit', this.handleAdd.bind(this), false);
  }

  createElement(todo) {
    const checkbox = createElement('input', { type: 'checkbox', className: 'checkbox', checked: todo.completed ? 'checked': ''})
    const label = createElement('label', { className: 'title' }, todo.title);
    const editInput = createElement('input', { type: 'text', className: 'textfield' });
    const editButton = createElement('button', { className: 'edit'}, 'Изменить');
    const removeButton = createElement('button', { className: 'remove'}, 'Удалить');
    const listItem = createElement('li', { className: `todo-item${todo.completed ? ' completed': ''}`, 'data-id': todo.id }, checkbox, label, editInput, editButton, removeButton);


    return this.addEventListeners(listItem);
  }

  addEventListeners(listItem) {
    const checkbox = listItem.querySelector('.checkbox');
    const editButton = listItem.querySelector('button.edit');
    const removeButton = listItem.querySelector('button.remove');

    checkbox.addEventListener('change', this.handleToggle.bind(this), false);
    editButton.addEventListener('click', this.handleEdit.bind(this), false);
    removeButton.addEventListener('click', this.handleRemove.bind(this), false);

    return listItem;
  }

  handleAdd(event) {
    event.preventDefault();

    if (!this.input.value) return alert('Необходимо ввсети название задачи');

    const value = this.input.value;

    this.emit('add', value);
  }

  handleToggle({ target }) {
    const listItem = target.parentNode;
    const id = listItem.getAttribute('data-id');
    const completed  = target.checked;

    this.emit('toggle', { id, completed} );
  }

  handleEdit({ target }) {
    const listItem = target.parentNode;
    const id = listItem.getAttribute('data-id');
    const label = listItem.querySelector('.title');
    const input = listItem.querySelector('.textfield');
    const editButton = listItem.querySelector('button.edit');
    const title = input.value;
    const isEditing = listItem.classList.contains('editing');

    if (isEditing) {
      this.emit('edit', {id, title});
    } else {
      input.value = label.textContent;
      editButton.textContent = 'Сохранить'
      listItem.classList.add('editing');
    }

  }

  handleRemove( {target }) {
    const listItem = target.parentNode;
    const id = listItem.getAttribute('data-id');

    this.emit('remove', id);
  }

  show(todos) {
      todos.forEach( todo => {
        const listItem = this.createElement(todo);

        this.list.appendChild(listItem);
      })

  }

  findListItem(id) {
    return this.list.querySelector(`[data-id="${id}"]`)
  }

  addItem(todo) {
    const listItem = this.createElement(todo);

    this.input.value = '';
    this.list.appendChild(listItem);
  }

  toggleItem(todo) {
    const listItem = this.findListItem(todo.id);
    const checkbox = listItem.querySelector('.checkbox');
    checkbox.checked = todo.completed;

    if (todo.completed) {
      listItem.classList.add('completed');
    } else {
      listItem.classList.remove('completed');
    }
  }

  editItem(todo) {
    const listItem = this.findListItem(todo.id);
    const label = listItem.querySelector('.title');
    const input = listItem.querySelector('.textfield');
    const editButton = listItem.querySelector('button.edit');

    label.textContent = todo.title;
    editButton.textContent = 'Изменить';
    listItem.classList.remove('editing');
  }

  removeItem(id) {
    const listItem = this.findListItem(id);

    this.list.removeChild(listItem);
  }

}

export default View;

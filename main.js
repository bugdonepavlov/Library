function LocalStorage(key) {
	this.key = key;
}

LocalStorage.prototype.fetch = function() {
	const data = JSON.parse(localStorage.getItem(this.key) || '[]');

	return data;
}

LocalStorage.prototype.sync = function(data) {
	localStorage.setItem(this.key, JSON.stringify(data));
}

function Library(options) {
 	this.storage = options.storage;
	this.list = this.storage.fetch();
	this.collectionNodes(options);
	this.bindEvents();
	this.render();
}

Library.prototype.collectionNodes = function (options) {
	this.container = document.getElementById(options.lists);
	this.author = document.getElementById(options.author);
	this.date = document.getElementById(options.date);
	this.nameBook = document.getElementById(options.nameBook);
	this.numberPages = document.getElementById(options.numberPages);
	this.btnSubmit = document.getElementById(options.btnSubmit);
	this.form = document.getElementById(options.form);
	this.hiddenID = document.getElementById(options.hiddenID);
}

Library.prototype.bindEvents = function() {
	const self = this;

	self.form.addEventListener('submit', function(e) {
		e.preventDefault();

		if (!self.btnSubmit.classList.contains('update')) {
			let valuesInputs = {
				id: Date.now(),
				author: self.author.value,
				date: self.date.value,
				name: self.nameBook.value,
				pages: self.numberPages.value
			};

			self.form.reset()
			self.add(valuesInputs);
		} else {
			self.btnSubmit.classList.remove('update');
			self.btnSubmit.textContent = 'Publish';
			self.edited(self.hiddenID.value);
			self.form.reset();
		}

	});
}

Library.prototype.createElement = function(index) {

	const html = `<li class="list-item" data-id="${this.list[index].id}">
					<h4>Автор: ${this.list[index].author}</h4>
					<p>Название: ${this.list[index].name}</p>
					<div class="btn-items">
						<button type="button" class="btn btn-danger removed">Remove</button>
						<button type="button" class="btn btn-warning edited">Edit</button>
					</div>
				</li>`;

	this.container.innerHTML += html;

	const removeBtn = document.getElementsByClassName("removed"),
		editBtn = document.getElementsByClassName('edited');

	for (let i of removeBtn) {
		i.addEventListener('click', function(e) {
			this.delete(e.target.closest('li'));
		}.bind(this))
	}

	for (let el of editBtn) {
		el.addEventListener('click', function(e) {
			this.btnSubmit.classList.add('update');
			this.btnSubmit.textContent = 'Update';

			this.update(e.target.closest('li'));
		}.bind(this));
	}
}

Library.prototype.edited = function(dataID) {

	this.list.map(function(el,i) {
		if (this.list[i].id == dataID) {
			this.list[i] = {
				id: dataID,
				author: this.author.value,
				date: this.date.value,
				name: this.nameBook.value,
				pages: this.numberPages.value
			}

			this.container.children[i].children[0].textContent = `Автор: ${this.list[i].author}`;
			this.container.children[i].children[1].textContent = `Название: ${this.list[i].name}`;
			this.storage.sync(this.list);
		}
	}.bind(this));

}

Library.prototype.update = function(btnID) {
	let attrID = btnID.getAttribute('data-id');

	this.list.map(function(el, i) {
		if (this.list[i].id == attrID) {
			this.hiddenID.value = attrID;
			this.author.value = this.list[i].author;
			this.date.value = this.list[i].date;
			this.nameBook.value = this.list[i].name;
			this.numberPages.value = this.list[i].pages;
		}
	}.bind(this));
}

Library.prototype.render = function() {
	this.list.map(function(el,i) {
		this.createElement(i);
	}.bind(this));
}

Library.prototype.add = function(data) {
	this.list.push(data);
	this.storage.sync(this.list);
	this.createElement(this.list.length-1);
}

Library.prototype.delete = function(btnTarget) {

	const item = btnTarget,
		itemID = item.getAttribute('data-id');

	for (var i = 0; i < this.list.length; i++) {

		if (this.list[i].id == itemID) {

			this.list.splice(i,1);
			item.remove();
		}
	}
	
	this.storage.sync(this.list);
}

const storage = new LocalStorage('library$1');

const library = new Library({
	lists: 'library-items',
	author: 'author',
	date: 'date',
	nameBook: 'nameABook',
	numberPages: 'numberPages',
	btnSubmit: 'pushBtn',
	form: 'form',
	hiddenID: 'dataID',
	storage: storage
});

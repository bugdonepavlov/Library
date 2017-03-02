function LocalStorage(key) {
	this.key = key;
}
LocalStorage.prototype.fetch = function() {
	let data = JSON.parse(localStorage.getItem(this.key) || '[]');

	return data
}
LocalStorage.prototype.sync = function(data) {
	localStorage.setItem(this.key, JSON.stringify(data))
}

let storage = new LocalStorage('library$1');

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
}
Library.prototype.bindEvents = function() {
	let self = this;

	self.btnSubmit.addEventListener('click', function(e) {
		e.preventDefault();

		let valuesInputs = {
			id: Date.now(),
			author: self.author.value,
			date: self.date.value,
			name: self.nameBook.value,
			pages: self.numberPages.value
		};

		self.add(valuesInputs);

	})

	let btn = document.querySelector('#updateBtn');
	btn.addEventListener('click', function(e) {
		e.preventDefault();
		self.edited(document.querySelector('#dataID').value)
	})


}
Library.prototype.createElement = function(index) {

	let html = `<li class="list-item" data-id="${this.list[index].id}">
					<h2>Автор: ${this.list[index].author}</h2>
					<p>Название книги: ${this.list[index].name}</p>
					<div class="btn-group">
						<button type="button" class="btn btn-default removed">Remove</button>
						<button type="button" class="btn btn-default edited">Edit</button>
					</div>
				</li>`;

	this.container.innerHTML += html;

	let removeBtn = document.getElementsByClassName("removed");

	for (let i of removeBtn) {
		i.addEventListener('click', function(e) {
			this.delete(e.target.closest('li'))
		}.bind(this))
	}

	let editBtn = document.getElementsByClassName('edited');

	for (let el of editBtn) {
		el.addEventListener('click', function(e) {
			this.update(e.target.closest('li'))
		}.bind(this))
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
			this.container.children[i].children[1].textContent = `Название книги: ${this.list[i].name}`;
			this.storage.sync(this.list);
		}
	}.bind(this))

}
Library.prototype.update = function(btnID) {
	let attrID = btnID.getAttribute('data-id');

	this.list.map(function(el, i) {
		if (this.list[i].id == attrID) {
			console.log(11)
			let input = document.querySelector('#dataID')
			input.value = attrID;
			this.author.value = this.list[i].author;
			this.date.value = this.list[i].date;
			this.nameBook.value = this.list[i].name;
			this.numberPages.value = this.list[i].pages;

		}
	}.bind(this))

	let btn = document.querySelector('#updateBtn');
	btn.addEventListener('click', function(e) {
		e.preventDefault();
	})
}
Library.prototype.render = function() {
	this.list.map(function(el,i) {
		this.createElement(i)
	}.bind(this))
}
Library.prototype.add = function(data) {
	this.list.push(data);
	this.storage.sync(this.list);
	this.createElement(this.list.length-1);
}
Library.prototype.delete = function(btnTarget) {
	let item = btnTarget,
		itemID = item.getAttribute('data-id');

	for (var i = 0; i < this.list.length; i++) {
		if (this.list[i].id === +itemID) {
			this.list.splice(i,1);
			item.style.display = 'none';
		}
	}
	this.storage.sync(this.list)
}

let library = new Library({
	lists: 'library-items',
	author: 'author',
	date: 'date',
	nameBook: 'nameABook',
	numberPages: 'numberPages',
	btnSubmit: 'pushBtn',
	storage: storage
})

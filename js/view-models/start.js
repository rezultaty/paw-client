// Here's my data model
var StartViewModel = function() {
	this.boards = [];
	this.boardsFiltered = ko.observableArray([]);
	this.filter = ko.observable('');
	this.showHiddenBoards = ko.observable(false);
	var self = this;
	this.update = function(){
		TrelloApi.boards.get(function(data){
			self.boards = data;
			self.boardsFiltered(self.applyFilter(self.boards, self.filter()));
		}, function(error){
			console.error(error);
		});
	};
	this.addTable = function(){
		var name = prompt('Podaj nazwę tablicy: ');
		if (name)
		{
			TrelloApi.boards.post({name: name}, function(result){
				self.boards.push(result);
				self.boardsFiltered(self.applyFilter(self.boards, self.filter()));
			}, function(error){
				console.error(error);
			});
		}
	};
	this.renameTable = function(obj){
		var name = prompt('Podaj nową nazwę tablicy: ');
		if (name)
		{
			TrelloApi.boards.put(obj.id, {name: name}, function(result){
				var board = self.boards.filter(function(e, i, a){ return e.id == result.id; });
				if (board.length > 0) self.boards.splice(self.boards.indexOf(board[0]), 1, result);
				else self.boards.push(result);
				self.boardsFiltered(self.applyFilter(self.boards, self.filter()));
			}, function(error){
				console.error(error);
			});
		}
	};
	this.deleteTable = function(obj){
		TrelloApi.boards.delete(obj.id, function(result){
			var board = self.boards.filter(function(e, i, a){ return e.id == obj.id; });
			if (board.length > 0) self.boards.splice(self.boards.indexOf(board[0]), 1);
			self.boardsFiltered(self.applyFilter(self.boards, self.filter()));
		}, function(error){
			console.error(error);
		});
	};
	this.closeTable = function(obj){
		TrelloApi.boards.put(obj.id, {archived: 1}, function(result){
			var board = self.boards.filter(function(e, i, a){ return e.id == result.id; });
			if (board.length > 0) self.boards.splice(self.boards.indexOf(board[0]), 1, result);
			else self.boards.push(result);
			self.boardsFiltered(self.applyFilter(self.boards, self.filter()));
		}, function(error){
			console.error(error);
		});
	};
	this.filter.subscribe(function(newValue) {
		self.boardsFiltered(self.applyFilter(self.boards, self.filter()));
	});
	this.applyFilter = function(array, value){
		if (value.length == 0) return array;
		return array.filter(function(e, i, a){
			return e.name.toLocaleLowerCase().includes(value.toLocaleLowerCase());
		});
	};
	this.test = function(){
		console.info(arguments);
	};
};

var StartViewModelObj = new StartViewModel();


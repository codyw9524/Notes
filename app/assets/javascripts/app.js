// Angular

var app = angular.module('myApp', ['ngRoute']);
app.config(function($routeProvider, $httpProvider){
	$routeProvider
		.when('/', {
			templateUrl: 'partials/show_note.html',
		})
		.when('/new', {
			templateUrl: 'partials/new_note.html',
		})
		.when('/show', {
			templateUrl: 'partials/show_note.html',
		})
		.when('/edit', {
			templateUrl: 'partials/edit_note.html',
		})
		.otherwise({
			redirectTo: '/'
		})
	$httpProvider.defaults.headers.common['X-CSRF-TOKEN'] = $('meta[name=csrf-token]').attr('content');
});

app.factory('noteFactory', function($http){
	var factory = {};
	factory.index = function(callback){
		$http.get('/notes').success(callback);
	}
	factory.create = function(input, callback){
		$http.post('/notes', input).success(callback);
	}
	factory.show = function(id, callback){
		$http.get('/notes/' + id).success(function(output){
			factory.note = output;
			factory.note.formattedDate = moment(output.created_at).format('MMMM Do YYYY, h:mm a');
			callback(output);
		});
	}
	factory.update = function(input, callback){
		$http.patch('/notes/' + input.note.id, input).success(function(output){
			factory.note = output;
			factory.note.formattedDate = moment(output.created_at).format('MMMM Do YYYY, h:mm a');
			callback(output);
		})
	}
	factory.destroy = function(id, callback){
		$http.delete('/notes/' + id).success(callback);
	}
	return factory;
})

app.controller('notesController', function($scope, noteFactory, $location){
	if(noteFactory.note){
		$scope.note = noteFactory.note;
	}
	if($location.$$path.indexOf('/edit') != -1){
		$scope.newNote = {note: $scope.note};
	}
	$scope.index = function(){
		noteFactory.index(function(json){
			for(i in json){
				json[i].formattedDate = moment(json[i].created_at).format('MMMM Do YYYY, h:mm a');
				json[i].fromNow = moment(json[i].created_at).calendar();
			}
			$scope.notes = json;
		})
	}
	$scope.create = function(){
		input = {note: {title: '', content: ''}};
		noteFactory.create(input, function(json){
			$scope.newNote = {};
			$scope.show(json.id);
			$scope.index();
		})
	}
	$scope.show = function(id){
		noteFactory.show(id, function(json){
			if($location.$$path.indexOf('/show') != -1){
				$scope.note = json;
				$("#note_content").val(json.content);
				$("#note_title").val(json.title);
			} else {
				$location.path('/show');
			}
		})
	}
	$scope.edit = function(id){
		noteFactory.show(id, function(json){
			if($location.$$path.indexOf('/edit') != -1){
				$scope.note = json;
				$scope.note.formattedDate = moment(json.created_at).format('MMMM Do YYYY, h:mm a');
				$scope.newNote = {note: $scope.note};
			} else {
				$location.path('/edit');
			}
		})
	}
	$scope.updateTitle = function(id){
		input = $('#note_title').val();
		input = {note: {id: id, title: input}};
		noteFactory.update(input, function(){
			 $scope.index();
		})
	}
	$scope.updateContent = function(id){
		input = $("#note_content").val();
		input = {note: {id: id, content: input}};
		noteFactory.update(input, function(){
			$scope.index();
		})
	}
	$scope.destroy = function(id){
		noteFactory.destroy(id, function(json){
			$scope.index();
		})
	}
	$scope.index();
})

// Clock

$(document).ready(function(){
	$('#clock span').html(moment().format('dddd, MMMM Do, YYYY h:mm:ss a'));
})

function updateClock(){
	$('#clock span').html(moment().format('dddd, MMMM Do, YYYY h:mm:ss a'));
}

setInterval(updateClock, 1000);

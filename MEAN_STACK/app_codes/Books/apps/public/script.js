var app = angular.module('myApp', []);

app.controller('myCtrl', function($scope, $http) {
  // Fetch all books on controller load
  $http({
    method: 'GET',
    url: '/book'
  }).then(function successCallback(response) {
    $scope.books = response.data;
  }, function errorCallback(response) {
    console.log('Error fetching books: ' + response);
  });

  // Delete a book
  $scope.del_book = function(book) {
    $http({
      method: 'DELETE',
      url: '/book/' + book.isbn // Using the ISBN parameter in the URL
    }).then(function successCallback(response) {
      console.log('Book deleted:', response);
      // Remove the deleted book from the list
      $scope.books = $scope.books.filter(b => b.isbn !== book.isbn);
    }, function errorCallback(response) {
      console.log('Error deleting book: ' + response);
    });
  };

  // Add a new book
  $scope.add_book = function() {
    var body = {
      name: $scope.Name,
      isbn: $scope.Isbn,
      author: $scope.Author,
      pages: $scope.Pages
    };

    $http({
      method: 'POST',
      url: '/book',
      data: body
    }).then(function successCallback(response) {
      console.log('Book added:', response);
      // Add the new book to the list
      $scope.books.push(response.data.book);
      // Clear input fields
      $scope.Name = '';
      $scope.Isbn = '';
      $scope.Author = '';
      $scope.Pages = '';
    }, function errorCallback(response) {
      console.log('Error adding book: ' + response);
    });
  };
});


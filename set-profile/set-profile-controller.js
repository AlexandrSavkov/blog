app.controller('setProfileCtrl', ['$scope', '$http', '$location', '$routeParams', '$rootScope', function($scope, $http, $location, $routeParams, $rootScope) {

  $http.get('/countries').then(function(res){
    $scope.countries = res.data.countries.sort();
  });

  var profileSettingFlag = false,
    oldProfileCountry = null,
    oldProfileName = null,
    oldProfileTown = null,
    oldProfilePhoto = null;

  var img = document.getElementById('profile-photo-img');

  $http.get('/getprofile').then(function(res){
    if (!res.data[0]) {
      $scope.defaultProfile();
    } else {
      $rootScope.profileName = res.data[0].name;
      $scope.profileTown = res.data[0].town;
      $scope.profileCountry = res.data[0].country;
      img.src = res.data[0].photo;
      $rootScope.profilePhoto = res.data[0].photo;

      oldProfileCountry = $scope.profileCountry;
      oldProfileName = $rootScope.profileName;
      oldProfileTown = $scope.profileTown;
      oldProfilePhoto = img.src;
    }
  });


  $scope.showForm = false;
  $scope.settingButton = 'Редактировать профиль';

  $scope.showSetting = function() {
    if (!profileSettingFlag) {   // if user do not save change, return old data
      $rootScope.profileName = oldProfileName;
      $scope.profileCountry = oldProfileCountry;
      $scope.profileTown = oldProfileTown;
      img.src = oldProfilePhoto;
      $rootScope.profilePhoto = oldProfilePhoto;
    }
    $scope.showForm = !$scope.showForm;
    $scope.settingButton = $scope.showForm ? 'Свернуть редактирование' : 'Редактировать профиль';
    profileSettingFlag = false;
  };

  $scope.changeImg = function() {
    var file = document.querySelector('input[type=file]').files[0];
    var reader = new FileReader();

    reader.onloadend = function() {
      img.src = reader.result;
      $rootScope.profilePhoto = reader.result;
    };

    if (file) {
      reader.readAsDataURL(file);
    } else {
      img.src = oldProfilePhoto;
      $rootScope.profilePhoto = oldProfilePhoto;
    }
  };

  $scope.saveProfile = function() {
    profileSettingFlag = true;
    $scope.settingButton = 'Редактировать профиль';
    $scope.showForm = !$scope.showForm;

    oldProfileCountry = $scope.profileCountry;
    oldProfileName = $rootScope.profileName;
    oldProfileTown = $scope.profileTown;
    oldProfilePhoto = $rootScope.profilePhoto;

    var data = {
      name: $rootScope.profileName,
      country: $scope.profileCountry,
      town: $scope.profileTown,
      photo: $rootScope.profilePhoto
    };
    $http.post('/setprofile', data).then(function(data){});
  };

  $scope.defaultProfile = function() {
      $rootScope.profileName = 'Name';
      $scope.profileTown = 'Town';
      $scope.profileCountry = 'Country';
      img.src = '';
      $rootScope.profilePhoto = '';

      oldProfileCountry = $scope.profileCountry;
      oldProfileName = $rootScope.profileName;
      oldProfileTown = $scope.profileTown;
      oldProfilePhoto = img.src;

      var data = {
        name: $rootScope.profileName,
        country: $scope.profileCountry,
        town: $scope.profileTown,
        photo: $rootScope.profilePhoto
      };
      $http.post('/setprofile', data).then(function(){});

    if ($scope.showForm) {
      $scope.showSetting()
    }
  };

}]);
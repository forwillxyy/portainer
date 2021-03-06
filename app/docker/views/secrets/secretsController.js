angular.module('portainer.docker')
.controller('SecretsController', ['$scope', '$state', 'SecretService', 'Notifications', 'Authentication',
function ($scope, $state, SecretService, Notifications, Authentication) {

  $scope.removeAction = function (selectedItems) {
    var actionCount = selectedItems.length;
    angular.forEach(selectedItems, function (secret) {
      SecretService.remove(secret.Id)
      .then(function success() {
        Notifications.success('Secret successfully removed', secret.Name);
        var index = $scope.secrets.indexOf(secret);
        $scope.secrets.splice(index, 1);
      })
      .catch(function error(err) {
        Notifications.error('Failure', err, 'Unable to remove secret');
      })
      .finally(function final() {
        --actionCount;
        if (actionCount === 0) {
          $state.reload();
        }
      });
    });
  };

  function initView() {
	$scope.isAdmin = isAdminAccess(Authentication);
	
    SecretService.secrets()
    .then(function success(data) {
      $scope.secrets = data;
    })
    .catch(function error(err) {
      $scope.secrets = [];
      Notifications.error('Failure', err, 'Unable to retrieve secrets');
    });
  }

  initView();
}]);

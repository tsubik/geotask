angular.module('donebytheway.controllers')
	.controller('SettingsCtrl', function($scope, settings, settingsService){
		$scope.settings = settings;
		$scope.subTitle = 'Ustawienia';
		$scope.changeServiceState = function(){
			if($scope.settings.isRunning){
				settingsService.startBackGroundService();
			}
			else{
				settingsService.stopBackGroundService();
			}
		}
	})
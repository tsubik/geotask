angular.module('donebytheway.controllers')
	.controller('SettingsCtrl', function($scope, settings, settingsService){
		$scope.settings = settings;

		$scope.changeServiceState = function(){
			if($scope.settings.isRunning){
				settingsService.startBackGroundService();
			}
			else{
				settingsService.stopBackGroundService();
			}
		}
	})
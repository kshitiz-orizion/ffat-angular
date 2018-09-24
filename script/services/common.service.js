(function() {
  'use strict';
  angular.module('myApp.services', []).factory('CommonData', [
    function() {
      var commonData = {};
      commonData.offenceTypes = [
        'Rape',
        'Dowry',
        'Female infanticides',
        'Domestic violences',
        'Illegal drug trade',
        'Human Trafficking',
        'Cyber crime',
        'Corruption and police misconduct',
        'Petty crimes',
        'Poaching and wildlife trafficking',
        'Murder',
        'Terrorism',
        'Arms Trafficking',
        'Child abuse',
        'Kidnapping',
        'Tax Evasion',
      ];
      commonData.criminalTypes = [
        'Indian fraudsters‎ (1 C, 10 P)',
        'Indian counterfeiters‎ (2 P)',
        'Indian drug traffickers‎ (4 P)',
        'Indian extortionists‎ (8 P)',
        'Indian kidnappers‎ (3 P)',
        'Indian mobsters‎ (4 C, 23 P)',
        'Indian money launderers‎ (6 P)',
        'Indian murderers‎ (4 C, 6 P)',
        'Indian poachers‎ (1 P)',
        'Indian rapists‎ (1 C, 11 P)',
        'Indian robbers‎ (13 P)',
        'Indian smugglers‎ (11 P)',
        'Indian people convicted of manslaughter‎ (2 P)',
      ];
      commonData.identityTypes = ['aadhar', 'driving', 'ration', 'passport', 'voter', 'pan'];
      return commonData;
    },
  ]);
})();

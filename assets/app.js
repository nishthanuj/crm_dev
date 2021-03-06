var crmApp = angular.module('crmApp', [ 'ngRoute',
    'crmApp.dashboardControllerModule', 'crmApp.accountControllerModule',
    'crmApp.leadControllerModule', 'crmApp.contactControllerModule',
    'crmApp.opportunityControllerModule', 'ui.calendar', 'ui.bootstrap' ]);

crmApp.config(function($routeProvider) {
  $routeProvider.when('/dashboard', {
    controller : 'dashboardController',
    templateUrl : 'dashboard/dashboard.html'
  }).when('/contacts', {
    controller : 'contactListController',
    templateUrl : 'contacts/partials/listContact.html'
  })
  .when('/addContact', {
    templateUrl : 'contacts/partials/createContact.html'
  }).when('/viewContact/:contactId', {
    controller : 'viewContactController',
    templateUrl : 'contacts/partials/viewContact.html'
  }).when('/accounts', {
    controller : 'accountListController',
    templateUrl : 'accounts/partials/listAccount.html'
  }).when('/viewAccount/:accountId', {
    controller : 'viewAccountController',
    templateUrl : 'accounts/partials/viewAccount.html'
  }).when('/addAccount', {
    templateUrl : 'accounts/partials/createAccount.html'
  }).when('/leads', {
    controller : 'leadListController',
    templateUrl : 'leads/partials/listLead.html'
  }).when('/addLead', {
    templateUrl : 'leads/partials/createLead.html'
  }).when('/viewLead/:leadId', {
    controller : 'viewLeadController',
    templateUrl : 'leads/partials/viewLead.html'
  }).when('/opportunities', {
    controller : 'opportunityListController',
    templateUrl : 'opportunity/partials/listOpportunity.html'
  }).when('/addOpportunity', {
    templateUrl : 'opportunity/partials/createOpportunity.html'
  }).when('/viewOpportunity/:opportunityId', {
    controller : 'viewOpportunityController',
    templateUrl : 'opportunity/partials/viewOpportunity.html'
  }).when('/events', {
    controller : 'calendarController',
    templateUrl : 'events/createEvent.html'
  }).otherwise({
    redirectTo : '/dashboard'
  });
});


/*controller for the calendar*/

crmApp.controller('calendarController', function($scope,$compile,uiCalendarConfig) {
  var date = new Date();
  var d = date.getDate();
  var m = date.getMonth();
  var y = date.getFullYear();
  
 
  /* event source that contains custom events on the scope */
  $scope.events = [
    {title: 'All Day Event',start: new Date(y, m, 1)},
    {title: 'Long Event',start: new Date(y, m, d - 5),end: new Date(y, m, d - 2)},
    {id: 999,title: 'Repeating Event',start: new Date(y, m, d - 3, 16, 0),allDay: false},
    {id: 999,title: 'Repeating Event',start: new Date(y, m, d + 4, 16, 0),allDay: false},
    {title: 'Birthday Party',start: new Date(y, m, d + 1, 19, 0),end: new Date(y, m, d + 1, 22, 30),allDay: false},
    {title: 'Click for Google',start: new Date(y, m, 28),end: new Date(y, m, 29),url: 'http://google.com/'}
  ];
  /* event source that calls a function on every view switch */
  $scope.eventsF = function (start, end, timezone, callback) {
    var s = new Date(start).getTime() / 1000;
    var e = new Date(end).getTime() / 1000;
    var m = new Date(start).getMonth();
    var events = [{title: 'Feed Me ' + m,start: s + (50000),end: s + (100000),allDay: false, className: ['customFeed']}];
    callback(events);
  };

  $scope.calEventsExt = {
     color: '#f00',
     textColor: 'yellow',
     events: [ 
        {type:'party',title: 'Lunch',start: new Date(y, m, d, 12, 0),end: new Date(y, m, d, 14, 0),allDay: false},
        {type:'party',title: 'Lunch 2',start: new Date(y, m, d, 12, 0),end: new Date(y, m, d, 14, 0),allDay: false},
        {type:'party',title: 'Click for Google',start: new Date(y, m, 28),end: new Date(y, m, 29),url: 'http://google.com/'}
      ]
  };
  /* alert on eventClick */
  $scope.alertOnEventClick = function( date, jsEvent, view){
      $scope.alertMessage = (date.title + ' was clicked ');
  };
  /* alert on Drop */
   $scope.alertOnDrop = function(event, delta, revertFunc, jsEvent, ui, view){
     $scope.alertMessage = ('Event Droped to make dayDelta ' + delta);
  };
  /* alert on Resize */
  $scope.alertOnResize = function(event, delta, revertFunc, jsEvent, ui, view ){
     $scope.alertMessage = ('Event Resized to make dayDelta ' + delta);
  };
  /* add and removes an event source of choice */
  $scope.addRemoveEventSource = function(sources,source) {
    var canAdd = 0;
    angular.forEach(sources,function(value, key){
      if(sources[key] === source){
        sources.splice(key,1);
        canAdd = 1;
      }
    });
    if(canAdd === 0){
      sources.push(source);
    }
  };
  /* add custom event*/
  $scope.addEvent = function() {
    $scope.events.push({
      title: 'Open Sesame',
      start: new Date(y, m, 28),
      end: new Date(y, m, 29),
      className: ['openSesame']
    });
  };
  /* remove event */
  $scope.remove = function(index) {
    $scope.events.splice(index,1);
  };
  /* Change View */
  $scope.changeView = function(view,calendar) {
    uiCalendarConfig.calendars[calendar].fullCalendar('changeView',view);
  };
  /* Change View */
  $scope.renderCalender = function(calendar) {
    if(uiCalendarConfig.calendars[calendar]){
      uiCalendarConfig.calendars[calendar].fullCalendar('render');
    }
  };
   /* Render Tooltip */
  $scope.eventRender = function( event, element, view ) { 
      element.attr({'tooltip': event.title,
                   'tooltip-append-to-body': true});
      $compile(element)($scope);
  };
  /* config object */
  $scope.uiConfig = {
    calendar:{
      height: 450,
      editable: true,
      header:{
        left: 'prev,next today',
        center: 'title',
        right: 'month,agendaWeek,agendaDay'
      },
      eventClick: $scope.alertOnEventClick,
      eventDrop: $scope.alertOnDrop,
      eventResize: $scope.alertOnResize,
      eventRender: $scope.eventRender,
      editable: true,
      selectable: true,
      selectHelper: true,
      select: function(start, end, allDay)
      {
          /*
              after selection user will be promted for enter title for event.
          */
          var title = prompt('Event Title:');
          /*
              if title is enterd calendar will add title and event into fullCalendar.
          */
          if (title)
          {
              calendar.fullCalendar('renderEvent',
                  {
                      title: title,
                      start: start,
                      end: end,
                      allDay: allDay
                  },
                  true // make the event "stick"
              );
          }
          calendar.fullCalendar('unselect');
      }
    }
  };

  $scope.changeLang = function() {
    if($scope.changeTo === 'Hungarian'){
      $scope.uiConfig.calendar.dayNames = ["VasÃ¡rnap", "HÃ©tfÅ‘", "Kedd", "Szerda", "CsÃ¼tÃ¶rtÃ¶k", "PÃ©ntek", "Szombat"];
      $scope.uiConfig.calendar.dayNamesShort = ["Vas", "HÃ©t", "Kedd", "Sze", "CsÃ¼t", "PÃ©n", "Szo"];
      $scope.changeTo= 'English';
    } else {
      $scope.uiConfig.calendar.dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
      $scope.uiConfig.calendar.dayNamesShort = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
      $scope.changeTo = 'Hungarian';
    }
  };
  /* event sources array*/
  $scope.eventSources = [$scope.events, $scope.eventSource, $scope.eventsF];
});

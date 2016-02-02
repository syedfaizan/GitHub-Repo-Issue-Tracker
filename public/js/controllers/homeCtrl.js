/**
 * Created by syedf on 2/2/2016.
 */
// The controller is use in the default page
angular
    .module('GRIT')
    .controller('homeCtrl',['$scope','GitHubAPI', function ($scope,GitHubAPI) {
        $scope.issues = {}; // initialize the variable
        $scope.clear = function () {
            $scope.repoUrl='';
            $scope.issues={}
        };
        // this function is called when the url is entered and submitted
        $scope.getIssues = function (repoUrl) {
            if(repoUrl){
                GitHubAPI
                    .getAllOpenIssues(repoUrl)
                    .success(function (response) {
                        $scope.issues.totalIssues = response.open_issues;
                    });
                GitHubAPI
                    .getOpenIssuesFrom24hours(repoUrl)
                    .success(function (response) {
                        $scope.issues.issuesInLast24Hours = response.length;
                        // This call is embedded in the callback of getOpenIssuesFrom24Hours because i want to guarantee i have a value in issuesin last 24 hours
                        GitHubAPI
                            .getIssuesOpened24HoursAgoAndLessThanAWeek(repoUrl)
                            .success(function (res) {
                                $scope.issues.issuesInLast7Days = res.length - $scope.issues.issuesInLast24Hours;
                                // Calculate more than 7 days ago issues here as we can guarantee the values of totalIssues and issuesInLast7days
                                $scope.issues.issuesOpenMoreThan7daysAgo = $scope.issues.totalIssues - $scope.issues.issuesInLast7Days - $scope.issues.issuesInLast24Hours;
                            })
                    });
            }
        }
    }]);
    
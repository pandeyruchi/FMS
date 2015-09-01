/**
 * Created by anjali tanpure on 14/8/15.
 */




// Directive to display google chart
angular.module('pune').directive('chartDirective', function () {
    return {
        restrict: 'A',
        link: function($scope, $elm, $attr) {
            var newData = [['Rating', 'Count'],
                ['March',  1],
                ['January',  7],
                ['July',  6],
                ['August',  3],
                ['December', 0]];

            var newSample={};
            for(var i =0; i<$scope.report.length ; i++)
            {
                var obj =$scope.report[i];
                newSample[obj.Rating] = obj.Count;
            }
            var result = [];

            for(var i in newSample)
                result.push([i, newSample[i]]);

            var numRows = result.length;
            var numCols = newData[0].length;
            var data = new google.visualization.DataTable();
            data.addColumn('string', newData[0][0]);

            // all other columns are of type 'number'.
            for (var i = 1; i < numCols; i++)
                data.addColumn('number', newData[0][i]);

            // now add the rows.
            for (var i = 0; i < numRows; i++)
                data.addRow(result[i]);

            // Set chart options
            var options = {'title':'Plumber Feedback',
                'width':1450,
                'height':700,
                'min':1,
                'max':5,
                backgroundColor: {
                    stroke: 'blue',
                    strokeWidth: 3
                }
            };

            // redraw the chart.
            var chart = new google.visualization.PieChart($elm[0]);
            chart.draw(data, options);
        }
    }
});

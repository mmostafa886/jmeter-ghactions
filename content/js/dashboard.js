/*
   Licensed to the Apache Software Foundation (ASF) under one or more
   contributor license agreements.  See the NOTICE file distributed with
   this work for additional information regarding copyright ownership.
   The ASF licenses this file to You under the Apache License, Version 2.0
   (the "License"); you may not use this file except in compliance with
   the License.  You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
var showControllersOnly = false;
var seriesFilter = "";
var filtersOnlySampleSeries = true;

/*
 * Add header in statistics table to group metrics by category
 * format
 *
 */
function summaryTableHeader(header) {
    var newRow = header.insertRow(-1);
    newRow.className = "tablesorter-no-sort";
    var cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Requests";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 3;
    cell.innerHTML = "Executions";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 7;
    cell.innerHTML = "Response Times (ms)";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Throughput";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 2;
    cell.innerHTML = "Network (KB/sec)";
    newRow.appendChild(cell);
}

/*
 * Populates the table identified by id parameter with the specified data and
 * format
 *
 */
function createTable(table, info, formatter, defaultSorts, seriesIndex, headerCreator) {
    var tableRef = table[0];

    // Create header and populate it with data.titles array
    var header = tableRef.createTHead();

    // Call callback is available
    if(headerCreator) {
        headerCreator(header);
    }

    var newRow = header.insertRow(-1);
    for (var index = 0; index < info.titles.length; index++) {
        var cell = document.createElement('th');
        cell.innerHTML = info.titles[index];
        newRow.appendChild(cell);
    }

    var tBody;

    // Create overall body if defined
    if(info.overall){
        tBody = document.createElement('tbody');
        tBody.className = "tablesorter-no-sort";
        tableRef.appendChild(tBody);
        var newRow = tBody.insertRow(-1);
        var data = info.overall.data;
        for(var index=0;index < data.length; index++){
            var cell = newRow.insertCell(-1);
            cell.innerHTML = formatter ? formatter(index, data[index]): data[index];
        }
    }

    // Create regular body
    tBody = document.createElement('tbody');
    tableRef.appendChild(tBody);

    var regexp;
    if(seriesFilter) {
        regexp = new RegExp(seriesFilter, 'i');
    }
    // Populate body with data.items array
    for(var index=0; index < info.items.length; index++){
        var item = info.items[index];
        if((!regexp || filtersOnlySampleSeries && !info.supportsControllersDiscrimination || regexp.test(item.data[seriesIndex]))
                &&
                (!showControllersOnly || !info.supportsControllersDiscrimination || item.isController)){
            if(item.data.length > 0) {
                var newRow = tBody.insertRow(-1);
                for(var col=0; col < item.data.length; col++){
                    var cell = newRow.insertCell(-1);
                    cell.innerHTML = formatter ? formatter(col, item.data[col]) : item.data[col];
                }
            }
        }
    }

    // Add support of columns sort
    table.tablesorter({sortList : defaultSorts});
}

$(document).ready(function() {

    // Customize table sorter default options
    $.extend( $.tablesorter.defaults, {
        theme: 'blue',
        cssInfoBlock: "tablesorter-no-sort",
        widthFixed: true,
        widgets: ['zebra']
    });

    var data = {"OkPercent": 100.0, "KoPercent": 0.0};
    var dataset = [
        {
            "label" : "FAIL",
            "data" : data.KoPercent,
            "color" : "#FF6347"
        },
        {
            "label" : "PASS",
            "data" : data.OkPercent,
            "color" : "#9ACD32"
        }];
    $.plot($("#flot-requests-summary"), dataset, {
        series : {
            pie : {
                show : true,
                radius : 1,
                label : {
                    show : true,
                    radius : 3 / 4,
                    formatter : function(label, series) {
                        return '<div style="font-size:8pt;text-align:center;padding:2px;color:white;">'
                            + label
                            + '<br/>'
                            + Math.round10(series.percent, -2)
                            + '%</div>';
                    },
                    background : {
                        opacity : 0.5,
                        color : '#000'
                    }
                }
            }
        },
        legend : {
            show : true
        }
    });

    // Creates APDEX table
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [1.0, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "HTTP Request_username003_password003-0"], "isController": false}, {"data": [1.0, 500, 1500, "HTTP Request_username008_password008-0"], "isController": false}, {"data": [1.0, 500, 1500, "HTTP Request_username003_password003-1"], "isController": false}, {"data": [1.0, 500, 1500, "Request_username009_password009"], "isController": false}, {"data": [1.0, 500, 1500, "Request_username006_password006"], "isController": false}, {"data": [1.0, 500, 1500, "Request_username007_password007"], "isController": false}, {"data": [1.0, 500, 1500, "HTTP Request_username008_password008-1"], "isController": false}, {"data": [1.0, 500, 1500, "Request_username004_password004"], "isController": false}, {"data": [1.0, 500, 1500, "Request_username005_password005"], "isController": false}, {"data": [1.0, 500, 1500, "HTTP Request_username001_password001"], "isController": false}, {"data": [1.0, 500, 1500, "HTTP Request_username001_password001-1"], "isController": false}, {"data": [1.0, 500, 1500, "HTTP Request_username001_password001-0"], "isController": false}, {"data": [1.0, 500, 1500, "HTTP Request_username010_password010-0"], "isController": false}, {"data": [1.0, 500, 1500, "HTTP Request_username010_password010-1"], "isController": false}, {"data": [1.0, 500, 1500, "HTTP Request_username005_password005-0"], "isController": false}, {"data": [1.0, 500, 1500, "HTTP Request_username005_password005-1"], "isController": false}, {"data": [1.0, 500, 1500, "Request_username008_password008"], "isController": false}, {"data": [1.0, 500, 1500, "HTTP Request_username007_password007-1"], "isController": false}, {"data": [1.0, 500, 1500, "HTTP Request_username002_password002-1"], "isController": false}, {"data": [1.0, 500, 1500, "HTTP Request_username007_password007-0"], "isController": false}, {"data": [1.0, 500, 1500, "HTTP Request_username007_password007"], "isController": false}, {"data": [1.0, 500, 1500, "HTTP Request_username009_password009-1"], "isController": false}, {"data": [1.0, 500, 1500, "Request_username010_password010"], "isController": false}, {"data": [1.0, 500, 1500, "HTTP Request_username003_password003"], "isController": false}, {"data": [1.0, 500, 1500, "HTTP Request_username009_password009-0"], "isController": false}, {"data": [1.0, 500, 1500, "HTTP Request_username008_password008"], "isController": false}, {"data": [1.0, 500, 1500, "HTTP Request_username009_password009"], "isController": false}, {"data": [1.0, 500, 1500, "HTTP Request_username002_password002"], "isController": false}, {"data": [1.0, 500, 1500, "HTTP Request_username006_password006-0"], "isController": false}, {"data": [1.0, 500, 1500, "HTTP Request_username004_password004"], "isController": false}, {"data": [1.0, 500, 1500, "Request_username002_password002"], "isController": false}, {"data": [1.0, 500, 1500, "HTTP Request_username002_password002-0"], "isController": false}, {"data": [1.0, 500, 1500, "HTTP Request_username004_password004-1"], "isController": false}, {"data": [1.0, 500, 1500, "HTTP Request_username005_password005"], "isController": false}, {"data": [1.0, 500, 1500, "Request_username003_password003"], "isController": false}, {"data": [1.0, 500, 1500, "HTTP Request_username006_password006"], "isController": false}, {"data": [1.0, 500, 1500, "Request_username001_password001"], "isController": false}, {"data": [1.0, 500, 1500, "HTTP Request_username006_password006-1"], "isController": false}, {"data": [1.0, 500, 1500, "HTTP Request_username010_password010"], "isController": false}, {"data": [1.0, 500, 1500, "HTTP Request_username004_password004-0"], "isController": false}]}, function(index, item){
        switch(index){
            case 0:
                item = item.toFixed(3);
                break;
            case 1:
            case 2:
                item = formatDuration(item);
                break;
        }
        return item;
    }, [[0, 0]], 3);

    // Create statistics table
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 40, 0, 0.0, 158.55, 47, 402, 128.5, 304.3, 384.04999999999984, 402.0, 34.69210754553339, 376.5414950130095, 3.8622072853425844], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["HTTP Request_username003_password003-0", 1, 0, 0.0, 187.0, 187, 187, 187.0, 187.0, 187.0, 187.0, 5.347593582887701, 4.3449197860962565, 0.5848930481283422], "isController": false}, {"data": ["HTTP Request_username008_password008-0", 1, 0, 0.0, 51.0, 51, 51, 51.0, 51.0, 51.0, 51.0, 19.607843137254903, 15.931372549019608, 2.144607843137255], "isController": false}, {"data": ["HTTP Request_username003_password003-1", 1, 0, 0.0, 108.0, 108, 108, 108.0, 108.0, 108.0, 108.0, 9.25925925925926, 193.4769241898148, 1.048900462962963], "isController": false}, {"data": ["Request_username009_password009", 1, 0, 0.0, 116.0, 116, 116, 116.0, 116.0, 116.0, 116.0, 8.620689655172413, 0.0, 0.0], "isController": false}, {"data": ["Request_username006_password006", 1, 0, 0.0, 347.0, 347, 347, 347.0, 347.0, 347.0, 347.0, 2.881844380403458, 0.0, 0.0], "isController": false}, {"data": ["Request_username007_password007", 1, 0, 0.0, 179.0, 179, 179, 179.0, 179.0, 179.0, 179.0, 5.58659217877095, 0.0, 0.0], "isController": false}, {"data": ["HTTP Request_username008_password008-1", 1, 0, 0.0, 76.0, 76, 76, 76.0, 76.0, 76.0, 76.0, 13.157894736842104, 274.7738486842105, 1.4905427631578947], "isController": false}, {"data": ["Request_username004_password004", 1, 0, 0.0, 199.0, 199, 199, 199.0, 199.0, 199.0, 199.0, 5.025125628140704, 0.0, 0.0], "isController": false}, {"data": ["Request_username005_password005", 1, 0, 0.0, 257.0, 257, 257, 257.0, 257.0, 257.0, 257.0, 3.8910505836575875, 0.0, 0.0], "isController": false}, {"data": ["HTTP Request_username001_password001", 1, 0, 0.0, 402.0, 402, 402, 402.0, 402.0, 402.0, 402.0, 2.487562189054726, 54.86969449626865, 0.5538712686567164], "isController": false}, {"data": ["HTTP Request_username001_password001-1", 1, 0, 0.0, 95.0, 95, 95, 95.0, 95.0, 95.0, 95.0, 10.526315789473683, 223.6328125, 1.1924342105263157], "isController": false}, {"data": ["HTTP Request_username001_password001-0", 1, 0, 0.0, 305.0, 305, 305, 305.0, 305.0, 305.0, 305.0, 3.278688524590164, 2.6639344262295084, 0.35860655737704916], "isController": false}, {"data": ["HTTP Request_username010_password010-0", 1, 0, 0.0, 47.0, 47, 47, 47.0, 47.0, 47.0, 47.0, 21.27659574468085, 17.28723404255319, 2.327127659574468], "isController": false}, {"data": ["HTTP Request_username010_password010-1", 1, 0, 0.0, 82.0, 82, 82, 82.0, 82.0, 82.0, 82.0, 12.195121951219512, 253.82288490853657, 1.3814786585365852], "isController": false}, {"data": ["HTTP Request_username005_password005-0", 1, 0, 0.0, 60.0, 60, 60, 60.0, 60.0, 60.0, 60.0, 16.666666666666668, 13.541666666666668, 1.8229166666666667], "isController": false}, {"data": ["HTTP Request_username005_password005-1", 1, 0, 0.0, 90.0, 90, 90, 90.0, 90.0, 90.0, 90.0, 11.11111111111111, 232.24826388888889, 1.2586805555555556], "isController": false}, {"data": ["Request_username008_password008", 1, 0, 0.0, 276.0, 276, 276, 276.0, 276.0, 276.0, 276.0, 3.6231884057971016, 0.0, 0.0], "isController": false}, {"data": ["HTTP Request_username007_password007-1", 1, 0, 0.0, 82.0, 82, 82, 82.0, 82.0, 82.0, 82.0, 12.195121951219512, 254.35880335365852, 1.3814786585365852], "isController": false}, {"data": ["HTTP Request_username002_password002-1", 1, 0, 0.0, 100.0, 100, 100, 100.0, 100.0, 100.0, 100.0, 10.0, 208.06640625, 1.1328125], "isController": false}, {"data": ["HTTP Request_username007_password007-0", 1, 0, 0.0, 50.0, 50, 50, 50.0, 50.0, 50.0, 50.0, 20.0, 16.25, 2.1875], "isController": false}, {"data": ["HTTP Request_username007_password007", 1, 0, 0.0, 133.0, 133, 133, 133.0, 133.0, 133.0, 133.0, 7.518796992481203, 162.93174342105263, 1.6741071428571428], "isController": false}, {"data": ["HTTP Request_username009_password009-1", 1, 0, 0.0, 76.0, 76, 76, 76.0, 76.0, 76.0, 76.0, 13.157894736842104, 274.40121299342104, 1.4905427631578947], "isController": false}, {"data": ["Request_username010_password010", 1, 0, 0.0, 216.0, 216, 216, 216.0, 216.0, 216.0, 216.0, 4.62962962962963, 0.0, 0.0], "isController": false}, {"data": ["HTTP Request_username003_password003", 1, 0, 0.0, 298.0, 298, 298, 298.0, 298.0, 298.0, 298.0, 3.3557046979865772, 72.84566380033557, 0.7471686241610739], "isController": false}, {"data": ["HTTP Request_username009_password009-0", 1, 0, 0.0, 50.0, 50, 50, 50.0, 50.0, 50.0, 50.0, 20.0, 16.25, 2.1875], "isController": false}, {"data": ["HTTP Request_username008_password008", 1, 0, 0.0, 128.0, 128, 128, 128.0, 128.0, 128.0, 128.0, 7.8125, 169.49462890625, 1.739501953125], "isController": false}, {"data": ["HTTP Request_username009_password009", 1, 0, 0.0, 127.0, 127, 127, 127.0, 127.0, 127.0, 127.0, 7.874015748031496, 170.6062376968504, 1.7531988188976377], "isController": false}, {"data": ["HTTP Request_username002_password002", 1, 0, 0.0, 386.0, 386, 386, 386.0, 386.0, 386.0, 386.0, 2.5906735751295336, 56.00813633419689, 0.5768296632124352], "isController": false}, {"data": ["HTTP Request_username006_password006-0", 1, 0, 0.0, 52.0, 52, 52, 52.0, 52.0, 52.0, 52.0, 19.230769230769234, 15.625, 2.1033653846153846], "isController": false}, {"data": ["HTTP Request_username004_password004", 1, 0, 0.0, 192.0, 192, 192, 192.0, 192.0, 192.0, 192.0, 5.208333333333333, 112.72684733072917, 1.15966796875], "isController": false}, {"data": ["Request_username002_password002", 1, 0, 0.0, 197.0, 197, 197, 197.0, 197.0, 197.0, 197.0, 5.076142131979695, 0.0, 0.0], "isController": false}, {"data": ["HTTP Request_username002_password002-0", 1, 0, 0.0, 283.0, 283, 283, 283.0, 283.0, 283.0, 283.0, 3.5335689045936394, 2.8710247349823326, 0.38648409893992935], "isController": false}, {"data": ["HTTP Request_username004_password004-1", 1, 0, 0.0, 102.0, 102, 102, 102.0, 102.0, 102.0, 102.0, 9.803921568627452, 204.22602634803923, 1.1106004901960784], "isController": false}, {"data": ["HTTP Request_username005_password005", 1, 0, 0.0, 150.0, 150, 150, 150.0, 150.0, 150.0, 150.0, 6.666666666666667, 144.765625, 1.484375], "isController": false}, {"data": ["Request_username003_password003", 1, 0, 0.0, 205.0, 205, 205, 205.0, 205.0, 205.0, 205.0, 4.878048780487805, 0.0, 0.0], "isController": false}, {"data": ["HTTP Request_username006_password006", 1, 0, 0.0, 140.0, 140, 140, 140.0, 140.0, 140.0, 140.0, 7.142857142857142, 154.82003348214283, 1.5904017857142856], "isController": false}, {"data": ["Request_username001_password001", 1, 0, 0.0, 194.0, 194, 194, 194.0, 194.0, 194.0, 194.0, 5.154639175257732, 0.0, 0.0], "isController": false}, {"data": ["HTTP Request_username006_password006-1", 1, 0, 0.0, 87.0, 87, 87, 87.0, 87.0, 87.0, 87.0, 11.494252873563218, 239.79660560344828, 1.3020833333333335], "isController": false}, {"data": ["HTTP Request_username010_password010", 1, 0, 0.0, 129.0, 129, 129, 129.0, 129.0, 129.0, 129.0, 7.751937984496124, 167.64322916666666, 1.726017441860465], "isController": false}, {"data": ["HTTP Request_username004_password004-0", 1, 0, 0.0, 88.0, 88, 88, 88.0, 88.0, 88.0, 88.0, 11.363636363636363, 9.232954545454547, 1.2428977272727273], "isController": false}]}, function(index, item){
        switch(index){
            // Errors pct
            case 3:
                item = item.toFixed(2) + '%';
                break;
            // Mean
            case 4:
            // Mean
            case 7:
            // Median
            case 8:
            // Percentile 1
            case 9:
            // Percentile 2
            case 10:
            // Percentile 3
            case 11:
            // Throughput
            case 12:
            // Kbytes/s
            case 13:
            // Sent Kbytes/s
                item = item.toFixed(2);
                break;
        }
        return item;
    }, [[0, 0]], 0, summaryTableHeader);

    // Create error table
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": []}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 40, 0, "", "", "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});

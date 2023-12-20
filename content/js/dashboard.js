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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [1.0, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "HTTP Request_1-0"], "isController": false}, {"data": [1.0, 500, 1500, "HTTP Request_2-0"], "isController": false}, {"data": [1.0, 500, 1500, "HTTP Request_1-1"], "isController": false}, {"data": [1.0, 500, 1500, "HTTP Request_2-1"], "isController": false}, {"data": [1.0, 500, 1500, "HTTP Request_3-0"], "isController": false}, {"data": [1.0, 500, 1500, "HTTP Request_14-0"], "isController": false}, {"data": [1.0, 500, 1500, "HTTP Request_3-1"], "isController": false}, {"data": [1.0, 500, 1500, "HTTP Request_4-0"], "isController": false}, {"data": [1.0, 500, 1500, "HTTP Request_14-1"], "isController": false}, {"data": [1.0, 500, 1500, "HTTP Request_19"], "isController": false}, {"data": [1.0, 500, 1500, "HTTP Request_15"], "isController": false}, {"data": [1.0, 500, 1500, "HTTP Request_17"], "isController": false}, {"data": [1.0, 500, 1500, "HTTP Request_11"], "isController": false}, {"data": [1.0, 500, 1500, "HTTP Request_12"], "isController": false}, {"data": [1.0, 500, 1500, "HTTP Request_13"], "isController": false}, {"data": [1.0, 500, 1500, "HTTP Request_9-0"], "isController": false}, {"data": [1.0, 500, 1500, "HTTP Request_9-1"], "isController": false}, {"data": [1.0, 500, 1500, "HTTP Request_30"], "isController": false}, {"data": [1.0, 500, 1500, "HTTP Request_4-1"], "isController": false}, {"data": [1.0, 500, 1500, "HTTP Request_18-0"], "isController": false}, {"data": [1.0, 500, 1500, "HTTP Request_18-1"], "isController": false}, {"data": [1.0, 500, 1500, "HTTP Request_24-0"], "isController": false}, {"data": [1.0, 500, 1500, "HTTP Request_24-1"], "isController": false}, {"data": [1.0, 500, 1500, "HTTP Request_21-0"], "isController": false}, {"data": [1.0, 500, 1500, "HTTP Request_21-1"], "isController": false}, {"data": [1.0, 500, 1500, "HTTP Request_28"], "isController": false}, {"data": [1.0, 500, 1500, "HTTP Request_22"], "isController": false}, {"data": [1.0, 500, 1500, "HTTP Request_25"], "isController": false}, {"data": [1.0, 500, 1500, "HTTP Request_27-0"], "isController": false}, {"data": [1.0, 500, 1500, "HTTP Request_27-1"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 30, 0, 0.0, 126.0, 35, 404, 103.0, 273.6, 372.65, 404.0, 32.15434083601286, 463.8514871382636, 4.772909967845659], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["HTTP Request_1-0", 1, 0, 0.0, 276.0, 276, 276, 276.0, 276.0, 276.0, 276.0, 3.6231884057971016, 2.9438405797101446, 0.3962862318840579], "isController": false}, {"data": ["HTTP Request_2-0", 1, 0, 0.0, 245.0, 245, 245, 245.0, 245.0, 245.0, 245.0, 4.081632653061225, 3.316326530612245, 0.44642857142857145], "isController": false}, {"data": ["HTTP Request_1-1", 1, 0, 0.0, 126.0, 126, 126, 126.0, 126.0, 126.0, 126.0, 7.936507936507936, 168.426029265873, 0.8990575396825397], "isController": false}, {"data": ["HTTP Request_2-1", 1, 0, 0.0, 102.0, 102, 102, 102.0, 102.0, 102.0, 102.0, 9.803921568627452, 204.94408700980392, 1.1106004901960784], "isController": false}, {"data": ["HTTP Request_3-0", 1, 0, 0.0, 146.0, 146, 146, 146.0, 146.0, 146.0, 146.0, 6.8493150684931505, 5.565068493150685, 0.7491438356164384], "isController": false}, {"data": ["HTTP Request_14-0", 1, 0, 0.0, 40.0, 40, 40, 40.0, 40.0, 40.0, 40.0, 25.0, 20.3125, 2.734375], "isController": false}, {"data": ["HTTP Request_3-1", 1, 0, 0.0, 106.0, 106, 106, 106.0, 106.0, 106.0, 106.0, 9.433962264150942, 196.62072523584905, 1.0686910377358492], "isController": false}, {"data": ["HTTP Request_4-0", 1, 0, 0.0, 53.0, 53, 53, 53.0, 53.0, 53.0, 53.0, 18.867924528301884, 15.330188679245284, 2.063679245283019], "isController": false}, {"data": ["HTTP Request_14-1", 1, 0, 0.0, 73.0, 73, 73, 73.0, 73.0, 73.0, 73.0, 13.698630136986301, 286.56089469178085, 1.5517979452054795], "isController": false}, {"data": ["HTTP Request_19", 1, 0, 0.0, 114.0, 114, 114, 114.0, 114.0, 114.0, 114.0, 8.771929824561402, 190.62671326754386, 1.953125], "isController": false}, {"data": ["HTTP Request_15", 1, 0, 0.0, 108.0, 108, 108, 108.0, 108.0, 108.0, 108.0, 9.25925925925926, 200.22243923611111, 2.0616319444444446], "isController": false}, {"data": ["HTTP Request_17", 1, 0, 0.0, 243.0, 243, 243, 243.0, 243.0, 243.0, 243.0, 4.11522633744856, 85.82497427983539, 0.9162808641975309], "isController": false}, {"data": ["HTTP Request_11", 1, 0, 0.0, 347.0, 347, 347, 347.0, 347.0, 347.0, 347.0, 2.881844380403458, 62.584429034582136, 0.6416606628242075], "isController": false}, {"data": ["HTTP Request_12", 1, 0, 0.0, 252.0, 252, 252, 252.0, 252.0, 252.0, 252.0, 3.968253968253968, 85.92974950396825, 0.8835565476190476], "isController": false}, {"data": ["HTTP Request_13", 1, 0, 0.0, 404.0, 404, 404, 404.0, 404.0, 404.0, 404.0, 2.4752475247524752, 54.54004873143564, 0.5511293316831682], "isController": false}, {"data": ["HTTP Request_9-0", 1, 0, 0.0, 39.0, 39, 39, 39.0, 39.0, 39.0, 39.0, 25.64102564102564, 20.833333333333332, 2.8044871794871793], "isController": false}, {"data": ["HTTP Request_9-1", 1, 0, 0.0, 68.0, 68, 68, 68.0, 68.0, 68.0, 68.0, 14.705882352941176, 306.0518152573529, 1.6659007352941175], "isController": false}, {"data": ["HTTP Request_30", 1, 0, 0.0, 101.0, 101, 101, 101.0, 101.0, 101.0, 101.0, 9.900990099009901, 214.8920946782178, 2.204517326732673], "isController": false}, {"data": ["HTTP Request_4-1", 1, 0, 0.0, 189.0, 189, 189, 189.0, 189.0, 189.0, 189.0, 5.291005291005291, 106.04745370370371, 0.5993716931216931], "isController": false}, {"data": ["HTTP Request_18-0", 1, 0, 0.0, 38.0, 38, 38, 38.0, 38.0, 38.0, 38.0, 26.31578947368421, 21.38157894736842, 2.8782894736842106], "isController": false}, {"data": ["HTTP Request_18-1", 1, 0, 0.0, 67.0, 67, 67, 67.0, 67.0, 67.0, 67.0, 14.925373134328359, 310.66347947761193, 1.6907649253731343], "isController": false}, {"data": ["HTTP Request_24-0", 1, 0, 0.0, 37.0, 37, 37, 37.0, 37.0, 37.0, 37.0, 27.027027027027028, 21.95945945945946, 2.956081081081081], "isController": false}, {"data": ["HTTP Request_24-1", 1, 0, 0.0, 67.0, 67, 67, 67.0, 67.0, 67.0, 67.0, 14.925373134328359, 312.0335820895522, 1.6907649253731343], "isController": false}, {"data": ["HTTP Request_21-0", 1, 0, 0.0, 38.0, 38, 38, 38.0, 38.0, 38.0, 38.0, 26.31578947368421, 21.38157894736842, 2.8782894736842106], "isController": false}, {"data": ["HTTP Request_21-1", 1, 0, 0.0, 76.0, 76, 76, 76.0, 76.0, 76.0, 76.0, 13.157894736842104, 275.1079358552632, 1.4905427631578947], "isController": false}, {"data": ["HTTP Request_28", 1, 0, 0.0, 104.0, 104, 104, 104.0, 104.0, 104.0, 104.0, 9.615384615384617, 208.8341346153846, 2.140925480769231], "isController": false}, {"data": ["HTTP Request_22", 1, 0, 0.0, 106.0, 106, 106, 106.0, 106.0, 106.0, 106.0, 9.433962264150942, 204.02785966981133, 2.1005306603773586], "isController": false}, {"data": ["HTTP Request_25", 1, 0, 0.0, 115.0, 115, 115, 115.0, 115.0, 115.0, 115.0, 8.695652173913043, 188.87567934782606, 1.936141304347826], "isController": false}, {"data": ["HTTP Request_27-0", 1, 0, 0.0, 35.0, 35, 35, 35.0, 35.0, 35.0, 35.0, 28.57142857142857, 23.21428571428571, 3.1249999999999996], "isController": false}, {"data": ["HTTP Request_27-1", 1, 0, 0.0, 65.0, 65, 65, 65.0, 65.0, 65.0, 65.0, 15.384615384615385, 321.4092548076923, 1.7427884615384615], "isController": false}]}, function(index, item){
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
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 30, 0, "", "", "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});

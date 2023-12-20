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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [1.0, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "HTTP Request_username003_password003-0"], "isController": false}, {"data": [1.0, 500, 1500, "HTTP Request_username008_password008-0"], "isController": false}, {"data": [1.0, 500, 1500, "HTTP Request_username003_password003-1"], "isController": false}, {"data": [1.0, 500, 1500, "Request_username009_password009"], "isController": false}, {"data": [1.0, 500, 1500, "Request_username006_password006"], "isController": false}, {"data": [1.0, 500, 1500, "Request_username007_password007"], "isController": false}, {"data": [1.0, 500, 1500, "HTTP Request_username008_password008-1"], "isController": false}, {"data": [1.0, 500, 1500, "Request_username004_password004"], "isController": false}, {"data": [1.0, 500, 1500, "Request_username005_password005"], "isController": false}, {"data": [1.0, 500, 1500, "HTTP Request_username001_password001"], "isController": false}, {"data": [1.0, 500, 1500, "HTTP Request_username001_password001-1"], "isController": false}, {"data": [1.0, 500, 1500, "HTTP Request_username001_password001-0"], "isController": false}, {"data": [1.0, 500, 1500, "HTTP Request_username010_password010-0"], "isController": false}, {"data": [1.0, 500, 1500, "HTTP Request_username010_password010-1"], "isController": false}, {"data": [1.0, 500, 1500, "HTTP Request_username005_password005-0"], "isController": false}, {"data": [1.0, 500, 1500, "HTTP Request_username005_password005-1"], "isController": false}, {"data": [1.0, 500, 1500, "Request_username008_password008"], "isController": false}, {"data": [1.0, 500, 1500, "HTTP Request_username007_password007-1"], "isController": false}, {"data": [1.0, 500, 1500, "HTTP Request_username002_password002-1"], "isController": false}, {"data": [1.0, 500, 1500, "HTTP Request_username007_password007-0"], "isController": false}, {"data": [1.0, 500, 1500, "HTTP Request_username007_password007"], "isController": false}, {"data": [1.0, 500, 1500, "HTTP Request_username009_password009-1"], "isController": false}, {"data": [1.0, 500, 1500, "Request_username010_password010"], "isController": false}, {"data": [1.0, 500, 1500, "HTTP Request_username003_password003"], "isController": false}, {"data": [1.0, 500, 1500, "HTTP Request_username009_password009-0"], "isController": false}, {"data": [1.0, 500, 1500, "HTTP Request_username008_password008"], "isController": false}, {"data": [1.0, 500, 1500, "HTTP Request_username009_password009"], "isController": false}, {"data": [1.0, 500, 1500, "HTTP Request_username002_password002"], "isController": false}, {"data": [1.0, 500, 1500, "HTTP Request_username006_password006-0"], "isController": false}, {"data": [1.0, 500, 1500, "HTTP Request_username004_password004"], "isController": false}, {"data": [1.0, 500, 1500, "Request_username002_password002"], "isController": false}, {"data": [1.0, 500, 1500, "HTTP Request_username004_password004-1"], "isController": false}, {"data": [1.0, 500, 1500, "HTTP Request_username002_password002-0"], "isController": false}, {"data": [1.0, 500, 1500, "HTTP Request_username005_password005"], "isController": false}, {"data": [1.0, 500, 1500, "Request_username003_password003"], "isController": false}, {"data": [1.0, 500, 1500, "HTTP Request_username006_password006"], "isController": false}, {"data": [1.0, 500, 1500, "Request_username001_password001"], "isController": false}, {"data": [1.0, 500, 1500, "HTTP Request_username006_password006-1"], "isController": false}, {"data": [1.0, 500, 1500, "HTTP Request_username010_password010"], "isController": false}, {"data": [1.0, 500, 1500, "HTTP Request_username004_password004-0"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 40, 0, 0.0, 193.75000000000003, 54, 453, 169.5, 389.49999999999994, 419.1499999999999, 453.0, 32.948929159802304, 358.0573646004942, 3.668142504118616], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["HTTP Request_username003_password003-0", 1, 0, 0.0, 179.0, 179, 179, 179.0, 179.0, 179.0, 179.0, 5.58659217877095, 4.539106145251397, 0.6110335195530726], "isController": false}, {"data": ["HTTP Request_username008_password008-0", 1, 0, 0.0, 58.0, 58, 58, 58.0, 58.0, 58.0, 58.0, 17.241379310344826, 14.00862068965517, 1.8857758620689655], "isController": false}, {"data": ["HTTP Request_username003_password003-1", 1, 0, 0.0, 115.0, 115, 115, 115.0, 115.0, 115.0, 115.0, 8.695652173913043, 181.66610054347825, 0.9850543478260869], "isController": false}, {"data": ["Request_username009_password009", 1, 0, 0.0, 160.0, 160, 160, 160.0, 160.0, 160.0, 160.0, 6.25, 0.0, 0.0], "isController": false}, {"data": ["Request_username006_password006", 1, 0, 0.0, 168.0, 168, 168, 168.0, 168.0, 168.0, 168.0, 5.952380952380952, 0.0, 0.0], "isController": false}, {"data": ["Request_username007_password007", 1, 0, 0.0, 349.0, 349, 349, 349.0, 349.0, 349.0, 349.0, 2.865329512893983, 0.0, 0.0], "isController": false}, {"data": ["HTTP Request_username008_password008-1", 1, 0, 0.0, 90.0, 90, 90, 90.0, 90.0, 90.0, 90.0, 11.11111111111111, 231.62977430555557, 1.2586805555555556], "isController": false}, {"data": ["Request_username004_password004", 1, 0, 0.0, 214.0, 214, 214, 214.0, 214.0, 214.0, 214.0, 4.672897196261682, 0.0, 0.0], "isController": false}, {"data": ["Request_username005_password005", 1, 0, 0.0, 293.0, 293, 293, 293.0, 293.0, 293.0, 293.0, 3.4129692832764507, 0.0, 0.0], "isController": false}, {"data": ["HTTP Request_username001_password001", 1, 0, 0.0, 403.0, 403, 403, 403.0, 403.0, 403.0, 403.0, 2.4813895781637716, 53.592199131513645, 0.5524968982630273], "isController": false}, {"data": ["HTTP Request_username001_password001-1", 1, 0, 0.0, 103.0, 103, 103, 103.0, 103.0, 103.0, 103.0, 9.70873786407767, 201.79763349514565, 1.0998179611650487], "isController": false}, {"data": ["HTTP Request_username001_password001-0", 1, 0, 0.0, 298.0, 298, 298, 298.0, 298.0, 298.0, 298.0, 3.3557046979865772, 2.726510067114094, 0.36703020134228187], "isController": false}, {"data": ["HTTP Request_username010_password010-0", 1, 0, 0.0, 54.0, 54, 54, 54.0, 54.0, 54.0, 54.0, 18.51851851851852, 15.046296296296296, 2.025462962962963], "isController": false}, {"data": ["HTTP Request_username010_password010-1", 1, 0, 0.0, 95.0, 95, 95, 95.0, 95.0, 95.0, 95.0, 10.526315789473683, 223.97203947368422, 1.1924342105263157], "isController": false}, {"data": ["HTTP Request_username005_password005-0", 1, 0, 0.0, 59.0, 59, 59, 59.0, 59.0, 59.0, 59.0, 16.949152542372882, 13.771186440677967, 1.853813559322034], "isController": false}, {"data": ["HTTP Request_username005_password005-1", 1, 0, 0.0, 111.0, 111, 111, 111.0, 111.0, 111.0, 111.0, 9.00900900900901, 187.45601069819818, 1.0205518018018018], "isController": false}, {"data": ["Request_username008_password008", 1, 0, 0.0, 318.0, 318, 318, 318.0, 318.0, 318.0, 318.0, 3.1446540880503147, 0.0, 0.0], "isController": false}, {"data": ["HTTP Request_username007_password007-1", 1, 0, 0.0, 221.0, 221, 221, 221.0, 221.0, 221.0, 221.0, 4.524886877828055, 94.37747454751131, 0.5125848416289592], "isController": false}, {"data": ["HTTP Request_username002_password002-1", 1, 0, 0.0, 142.0, 142, 142, 142.0, 142.0, 142.0, 142.0, 7.042253521126761, 146.4018485915493, 0.7977552816901409], "isController": false}, {"data": ["HTTP Request_username007_password007-0", 1, 0, 0.0, 58.0, 58, 58, 58.0, 58.0, 58.0, 58.0, 17.241379310344826, 14.00862068965517, 1.8857758620689655], "isController": false}, {"data": ["HTTP Request_username007_password007", 1, 0, 0.0, 280.0, 280, 280, 280.0, 280.0, 280.0, 280.0, 3.571428571428571, 77.39257812499999, 0.7952008928571428], "isController": false}, {"data": ["HTTP Request_username009_password009-1", 1, 0, 0.0, 99.0, 99, 99, 99.0, 99.0, 99.0, 99.0, 10.101010101010102, 214.77470012626262, 1.1442550505050504], "isController": false}, {"data": ["Request_username010_password010", 1, 0, 0.0, 254.0, 254, 254, 254.0, 254.0, 254.0, 254.0, 3.937007874015748, 0.0, 0.0], "isController": false}, {"data": ["HTTP Request_username003_password003", 1, 0, 0.0, 296.0, 296, 296, 296.0, 296.0, 296.0, 296.0, 3.3783783783783785, 73.32466744087839, 0.7522170608108109], "isController": false}, {"data": ["HTTP Request_username009_password009-0", 1, 0, 0.0, 54.0, 54, 54, 54.0, 54.0, 54.0, 54.0, 18.51851851851852, 15.046296296296296, 2.025462962962963], "isController": false}, {"data": ["HTTP Request_username008_password008", 1, 0, 0.0, 149.0, 149, 149, 149.0, 149.0, 149.0, 149.0, 6.7114093959731544, 145.36362206375838, 1.4943372483221478], "isController": false}, {"data": ["HTTP Request_username009_password009", 1, 0, 0.0, 154.0, 154, 154, 154.0, 154.0, 154.0, 154.0, 6.493506493506494, 143.34542410714286, 1.4458198051948052], "isController": false}, {"data": ["HTTP Request_username002_password002", 1, 0, 0.0, 420.0, 420, 420, 420.0, 420.0, 420.0, 420.0, 2.3809523809523814, 51.43229166666667, 0.5301339285714286], "isController": false}, {"data": ["HTTP Request_username006_password006-0", 1, 0, 0.0, 58.0, 58, 58, 58.0, 58.0, 58.0, 58.0, 17.241379310344826, 14.00862068965517, 1.8857758620689655], "isController": false}, {"data": ["HTTP Request_username004_password004", 1, 0, 0.0, 190.0, 190, 190, 190.0, 190.0, 190.0, 190.0, 5.263157894736842, 114.02138157894737, 1.171875], "isController": false}, {"data": ["Request_username002_password002", 1, 0, 0.0, 247.0, 247, 247, 247.0, 247.0, 247.0, 247.0, 4.048582995951417, 0.0, 0.0], "isController": false}, {"data": ["HTTP Request_username004_password004-1", 1, 0, 0.0, 109.0, 109, 109, 109.0, 109.0, 109.0, 109.0, 9.174311926605505, 191.2987385321101, 1.0392775229357798], "isController": false}, {"data": ["HTTP Request_username002_password002-0", 1, 0, 0.0, 276.0, 276, 276, 276.0, 276.0, 276.0, 276.0, 3.6231884057971016, 2.9438405797101446, 0.3962862318840579], "isController": false}, {"data": ["HTTP Request_username005_password005", 1, 0, 0.0, 171.0, 171, 171, 171.0, 171.0, 171.0, 171.0, 5.847953216374268, 126.43343384502923, 1.3020833333333333], "isController": false}, {"data": ["Request_username003_password003", 1, 0, 0.0, 220.0, 220, 220, 220.0, 220.0, 220.0, 220.0, 4.545454545454545, 0.0, 0.0], "isController": false}, {"data": ["HTTP Request_username006_password006", 1, 0, 0.0, 453.0, 453, 453, 453.0, 453.0, 453.0, 453.0, 2.207505518763797, 47.81275869205298, 0.4915149006622516], "isController": false}, {"data": ["Request_username001_password001", 1, 0, 0.0, 210.0, 210, 210, 210.0, 210.0, 210.0, 210.0, 4.761904761904763, 0.0, 0.0], "isController": false}, {"data": ["HTTP Request_username006_password006-1", 1, 0, 0.0, 394.0, 394, 394, 394.0, 394.0, 394.0, 394.0, 2.5380710659898473, 52.910354536802025, 0.2875158629441624], "isController": false}, {"data": ["HTTP Request_username010_password010", 1, 0, 0.0, 149.0, 149, 149, 149.0, 149.0, 149.0, 149.0, 6.7114093959731544, 148.25398489932886, 1.4943372483221478], "isController": false}, {"data": ["HTTP Request_username004_password004-0", 1, 0, 0.0, 79.0, 79, 79, 79.0, 79.0, 79.0, 79.0, 12.658227848101266, 10.284810126582279, 1.384493670886076], "isController": false}]}, function(index, item){
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

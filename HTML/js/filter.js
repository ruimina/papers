var start_time = Date.now();
var tableData;
tableData = {data: JSON.parse(get_data())};

var index = elasticlunr(function () {
    this.addField('PaperNum');
    this.addField('PaperTitle');
    this.addField('AuthorText');
    this.addField('FileName');
    this.addField('Body');
    this.setRef('id');
});

tableData.data.map(x => index.addDoc(x));

var template = $('#template').html();
Mustache.parse(template); // optional, speeds up future uses

var index_end_time = Date.now();
var indexing_time = index_end_time - start_time;
console.log("Indexing done in " + indexing_time + " ms");

$("#filter").on("input", function() {
    var start_search_time = Date.now();
    var search_term = $(this).val();
    var list = {data: []};
    if (search_term.length > 3) {
        var results = index.search(search_term, {
            fields: {
                PaperTitle: {boost: 3},
                AuthorText: {boost: 2},
                Body: {boost: 1}
            }
        }); 
        results.map(x=>list.data.push(x.doc))
    }
    //console.log(list);
    
    // process and render template
    var rendered = Mustache.render(template, list);
    //console.log(rendered);
    $('#searchResults').html(rendered);
    var end_time = Date.now();
    var search_time = end_time - start_search_time;
    console.log("Search done in " + search_time + " ms");
});

var $pagination = $("#pagination"),
    totalRecords = 0,
    records = [],
    displayRecords = [],
    recPerPage = 24,
    page = 1,
    totalPages = 0,
    code = '111',
    flag = 'onload',
    searchText = '';

function apply_pagination() {
    $pagination.twbsPagination({
        totalPages: totalPages,
        visiblePages: 6,
        onPageClick: function (event, page) {
            debugger;
            displayImages(page);
        }
    });
    if (page == 1) {
        debugger;
        if (!$("#pagination > .first").hasClass("disabled")) {
            $("#pagination > .first").trigger("click");
        }
        else {
            $("#pagination > .next").trigger("click");
            $("#pagination > .first").trigger("click");
        }
    }
}

function displayImages(page) {
    debugger;
    var url = '';
    if (flag == 'latest') {
        url = `https://cors-anywhere.herokuapp.com/wallhaven.cc/api/v1/search?page=` + page;
        $('#pageHeading').html('<b><h2>Latest</h2></b><hr>');
    }
    else if (flag == 'top') {
        url = `https://cors-anywhere.herokuapp.com/wallhaven.cc/api/v1/search?sorting=toplist&topRange=1w&page=` + page;
        $('#pageHeading').html('<b><h2>Top</h2></b><hr>');
    }
    else if (flag == 'onload') {
        url = `https://cors-anywhere.herokuapp.com/wallhaven.cc/api/v1/search?type=png&sorting=relevance&page=` + page;
        $('#pageHeading').html('<b><h2>Trending</h2></b><hr>');
    }
    else if (flag == 'search') {
        url = `https://cors-anywhere.herokuapp.com/wallhaven.cc/api/v1/search?page=` + page + `&categories=` + code;
        $('#pageHeading').html('<b><h2>' + searchText.toUpperCase() + '</h2></b><hr>');
    }
    $.ajax({
        method: "GET",
        async: false,
        url: url,
        success: function (response) {
            //console.log(response);
            if (response != null) {
                let reqdata = response.data;
                console.log(reqdata)
                var row = "";
                var ctr = 0
                reqdata.forEach((element, index) => {
                    if (ctr % 4 == 0) {
                        row += '<tr>';
                    }
                    let imageUrl = reqdata[index].thumbs.large;
                    let imageId = reqdata[index].id;
                    row += '<td><img id="img' + (ctr + 1) + '" src="' + imageUrl + '" width="100%;" height="90%;" data-id="' + imageId + '"></td>';
                    if (ctr % 4 == 3) {
                        row += '</tr>';
                    }
                    ctr++;
                });
                $("#tblSearchImages").html('');
                $("#tblSearchImages").append(row);
            }
        },
        error: function (errorText, error) {
            console.log(error, errorText);
        }
    });
}

window.onload = function () {
    debugger;
    $("#header").load('header.html');
    $.ajax({
        method: "GET",
        url: `https://cors-anywhere.herokuapp.com/wallhaven.cc/api/v1/search?type=png&sorting=relevance&page=` + page,
        success: function (response) {
            console.log(response);
            if (response != null) {
                let reqdata = response.data;
                records = reqdata;
                console.log(reqdata);
                totalRecords = response.meta.total;
                totalPages = Math.ceil(totalRecords / recPerPage);
                debugger;
                flag = 'onload';
                apply_pagination();
            }
        },
        error: function (jqXHR, errorText, error) {
            flag = 'onload';
            apply_pagination();
            console.log(error, errorText);
        }
    });
};

$("#btnSearch").click(function (e) {
    e.preventDefault();
    debugger;
    searchText = $("#txtsearch").val().toUpperCase();

    debugger;
    if (searchText == 'ANIME') {
        code = '010';
    }
    else if (searchText == 'GENERAL') {
        code = '100';
    }
    else if (searchText == 'PEOPLE') {
        code = '001';
    }
    var searchUrl = `https://cors-anywhere.herokuapp.com/wallhaven.cc/api/v1/search?categories=` + code;
    page = 1;
    $.ajax({
        method: "GET",
        async: false,
        url: searchUrl,
        success: function (response) {
            console.log(response);
            debugger;
            if (response != null) {
                let reqdata = response.data;
                console.log(reqdata)
                records = reqdata;
                console.log(reqdata);
                totalRecords = response.meta.total;
                totalPages = Math.ceil(totalRecords / recPerPage);
                debugger;
                flag = 'search';
                apply_pagination();
            }
        },
        error: function (errorText, error) {
            console.log(error, errorText);
        }
    });
});
// Render Repo Item as Html
const render_repo_item = (item) => {
  item_html = '<div class="item">' + 
                '<div class="content">' +
                  '<h2 class="header"><a class="header" target="_blank" href="' + item.html_url + '">' + item.name + '</a></h2>' +
                  '<p class="description">' + item.description + '</p>' + 
                  '<div class="owner">' +
                    '<p><i class="user icon"></i>' + item.owner.login + 
                    ' <span><b>' + item.owner.followers_count + '</b> followers <span><b>' + item.owner.following_count + '</b> following </span></p>' +
                  '</div>' +
                  '<div class="meta">' +
                    '<p> <i class="star icon"></i> ' + item.stargazers_count + ' <i class="download icon"></i> ' + item.forks_count +
                  '</div>' +
                '</div>' +
              '</div>';
  $("#repos-list").append(item_html);
}

// Repos search function 
// params:
//  query: string - search value
//  sort: string - filter/sort value
// output:
//  items: array - repos search result
const search = (query, sort) => {
  let items = [];
  $.ajax({
    type: 'get',
    url: '/repos',
    data: { q: query, sort: sort },
    dataType: 'json',
    error: function(XMLHttpRequest, textStatus, errorThrown) {
      $("#repos-list").html("<p>" + errorThrown + "</p>");
      $(".ui.loader").removeClass("active");
      return items;
    }
  })
  .done((data) => {
    $("#repos-list").html("");
    let followers_count = 0;
    let following_count = 0;

    items = data.items;
    $.each(items, function(key, item) {
      // get followers and following count
      $.ajax({
        type: 'get',
        url: '/repos/'+item.owner.login,
        dataType: 'json',
      })
      .done((user) => {
        followers_count = user.followers;
        following_count = user.following;
        item.owner['followers_count'] = user.followers;
        item.owner['following_count'] = user.following;
        items[key] = item;
        render_repo_item(item);
      });
    });
    $(".ui.loader").removeClass("active");
    return items;
  });
}

const list_repositories = () => {
  $('input[name=q]').removeClass("error");

  const query = $('input[name=q]').val();
  const sort = $('select[name=sort]').val();
  if(query.trim() === "") {
    $('input[name=q]').addClass("error");
    return;
  }

  $(".ui.loader").addClass("active");
  search(query, sort);
}

$(document).ready(function(){

  $("form#search-form").on('submit', function(e){
    e.preventDefault();
    list_repositories();
  });

  $("select[name=sort]").on('change', function(e){
    list_repositories();
  });
});

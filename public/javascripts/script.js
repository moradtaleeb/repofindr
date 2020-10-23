$(document).ready(function(){
  const list_repositories = () => {
    $('input[name=q]').removeClass("error");
    const query = $('input[name=q]').val();
    if(query.trim() === "") {
      $('input[name=q]').addClass("error");
      return;
    }
    $(".ui.loader").addClass("active");
    const sort = $('select[name=sort]').val();
    $.ajax({
      type: 'get',
      url: '/repos',
      data: { q: query, sort: sort },
      dataType: 'json',
      error: function(XMLHttpRequest, textStatus, errorThrown) {
        $("#repos-list").html("<p>" + errorThrown + "</p>");
        $(".ui.loader").removeClass("active");
      }
    })
    .done(function(data){
      $("#repos-list").html("");
      let followers_count = 0;
      let following_count = 0;

      $.each(data.items, function(key, item) {
        // get followers and following count
        $.ajax({
          type: 'get',
          url: '/repos/'+item.owner.login,
          dataType: 'json',
        })
        .done(function(user) {
          followers_count = user.followers;
          following_count = user.following;
          item_html = '<div class="item">' + 
                      '<div class="content">' +
                        '<h2 class="header"><a class="header" target="_blank" href="' + item.html_url + '">' + item.name + '</a></h2>' +
                        '<p class="description">' + item.description + '</p>' + 
                        '<div class="owner">' +
                          '<p><i class="user icon"></i>' + item.owner.login + ' <span><b>' + followers_count + '</b> followers <span><b>' + following_count + '</b> following </span></p>' +
                        '</div>' +
                        '<div class="meta">' +
                          '<p> <i class="star icon"></i> ' + item.stargazers_count + ' <i class="download icon"></i> ' + item.forks_count +
                        '</div>' +
                      '</div>' +
                    '</div>';
          $("#repos-list").append(item_html);
        });
      });
      $(".ui.loader").removeClass("active");
    });
  }

  $("form#search-form").on('submit', function(e){
    e.preventDefault();
    list_repositories();
  });

  $("select[name=sort]").on('change', function(e){
    list_repositories();
  });
});

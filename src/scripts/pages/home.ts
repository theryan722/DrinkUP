onPageInit('home', function () {
    loadHomePopups();
});

function loadHomePopups() {
    app.request.get('reuse/drink_full_popup.html', function (data: string) {
        $$('.homepopups').html(data);
    });
    app.request.get('reuse/drink_sip_popup.html', function (data: string) {
        $$('.homepopups').append(data);
    });
}
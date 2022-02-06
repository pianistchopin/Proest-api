function editStudy(id, title) {
    $("#study_id").val(id);
    $("#study_title").val(title);
}

function deleteStudy(id){
    $.ajax({
        url: "/crud/study/delete",
        type: "POST",
        data: {
            id: id
        },
        success: function( result ) {
            console.log(result);
            if(result.status)
                location.reload();
            else alert(result.message);
        }
    });
}
function editCourse(id, title) {
    $("#course_id").val(id);
    $("#course_title").val(title);
}

function deleteCourse(id){
    $.ajax({
        url: "/crud/course/delete",
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
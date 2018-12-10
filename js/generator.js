$(document).ready(function() {

    var OCTO_APIM_APP = OCTO_APIM_APP || {};

    OCTO_APIM_APP.app = {
        conf: null,
        init: function() {
            var self = this;
            $("section").hide();
            $("input[type=radio]").removeAttr('checked');
            console.log($("input[type=radio]"));

            $("#logo").click(function() {
                app.init();
            });

            $("#section-start-quizz").click(function() {
                $("#section-start-quizz").hide();
                $("#section-quizz").fadeIn();
            });

            $("form").submit(function(e) {
                e.preventDefault();
            });

            $("section").hide();
            $("#section-search-result").html("");
            $("#menu-search").addClass("btn-primary");
            $("#menu-create").removeClass("btn-primary");
            $("#what-dev-form").fadeIn();
            $("#section-start-quizz").fadeIn();

            //$("#bg").attr("src", "./img/octo-tribes.svg");
            $("#bg").attr("src", "./img/background.jpg");
            //$("#bg").attr("src", "./img/38559874055_e02dd12c31_o (1).jpg");
            $("#bg").fadeIn(2000);

            // load json conf
            $.ajax({
                url: "./conf/conf.json",
                type: 'GET',
                dataType: "json",
                crossDomain: true,
                cache: false,
                success: function(data) {
                    self.conf = data;

                    // set question
                    var htmlquizz = self.generateFormBloc();
                    $("#section-quizz").html(htmlquizz);
                    $("input[type=radio]").click(function(e) {
                        e.preventDefault();
                        var current = $(this);
                        var ID = current.attr("id");
                        console.log("handler - cal click handler for id:" + current.attr("id"));
                        console.log("handler -  - question.type:" + self.conf.quizz[ID].type);
                        if(self.conf.quizz[ID].type == "leaf") {
                            console.log("handler - LEAF !");
                            var htmlapims = '<div class="row">';
                            var apims = self.conf.quizz[ID].apim;
                            for(var i = 0; i < apims.length; i++) {
                                var apim = apims[i];
                                console.log("handler - iterating APIM :" + apim);
                                for(var j = 0; j < self.conf.vendorsolutions.length; j++) {
                                    if(apim == self.conf.vendorsolutions[j].id) {
                                        console.log("handler - adding APIM :" + apim);
                                        htmlapims += self.generateVendorSolutionBloc(self.conf.vendorsolutions[j]);
                                        if(i != 0 && (i + 1) % 3 === 0) {
                                            htmlapims += '</div>';
                                            htmlapims += '<div class="row">';
                                        }
                                    }
                                }
                            }
                            htmlapims += '</div>';
                            $("form").hide();
                            $("#section-quizz").hide();
                            $("#section-solutions").html(htmlapims);
                            $("#section-solutions").fadeIn();
                        } else {
                            console.log("handler - No LEAF so QUESTION !");
                            $("form").hide();
                            $("#form-" + current.attr("id")).fadeIn();
                        }
                    });

                    $("form").hide();
                    $("#form-ID1").fadeIn();
                },
                error: function(xhr, ajaxOptions, thrownError) {
                    console.log("search ajax error!");
                    console.log(xhr.status);
                    console.log(thrownError);
                }
            });

            console.log("app initialized...");
        },
        generateFormBloc: function() {
            console.log("generateFormBloc()");
            var self = this;
            var html = '<div class="row">';
            html += '<div class="col-md-12">';
            html += '<div class="card">';
            html += '<div class="card-body quizz">';
            for(var question in this.conf.quizz) {
                console.log("generateFormBloc()");
                console.log(question);
                console.log("generateFormBloc() - question.type:" + self.conf.quizz[question].type);
                if(self.conf.quizz[question].type == "leaf") {
                    console.log("generateFormBloc() - LEAF !");
                } else {
                    console.log("generateFormBloc() - No LEAF so QUESTION !");
                    html += self.generateQuestionBloc(question);
                }
            }
            html += '</div>';
            html += '</div>';
            html += '</div>';
            html += '</div>';
            $("#section-quizz").html(html);
        },
        generateQuestionBloc: function(quizzID) {
            console.log('generateQuestionBloc() - ' + quizzID);
            var self = this;
            var question = this.conf.quizz[quizzID];

            var html = '<form id="form-' + quizzID + '" class="needs-validation">';
            html += '<h1 class="mb-3">' + question.question + '</h1>';
            for(var i = 0; i < question.answers.length; i++) {
                var id = 'ID' + question.answers[i].goto + '';
                html += '<div class="form-check">';
                html += '<input class="form-check-input" type="radio" name="' + question.answers[i].goto + '" id="' + id + '" value="' + question.answers[i].answer + '">';
                html += '<label class="form-check-label" for="' + id + '">';
                html += '' + question.answers[i].answer + '';
                html += '</label>';
                html += '</div>';
                console.log('generateQuestionBloc: #ID:' + id);
            }
            html += '</form>';
            return html;
        },
        generateVendorSolutionBloc: function(apim) {
            var html = '<div class="col-md-4">';
            html += '<div class="card">';
            html += '<img class="card-img-top card-header" src="' + apim.image + '" alt="' + apim.name + '">';
            html += '<div class="card-body">';
            html += '<h5 class="card-title">' + apim.name + '</h5>';
            html += '<p class="card-text">' + apim.description + '</p>';
            if(apim.website) {
                html += '<a href="#" class="btn btn-primary"><span class="oi oi-external-link" title="icon name" aria-hidden="true"></span> ' + apim.website + '</a>';
            }
            html += '</div>';

            html += '<ul class="list-group list-group-flush">';
            html += '<li class="list-group-item">';
            for(var i = 0; i < apim.pros.length; i++) {
                html += '<span class="oi oi-plus text-success" title="icon name" aria-hidden="true"></span> ' + apim.pros[i] + '<br />';
            }
            html += '</li>';
            html += '<li class="list-group-item">';
            for(var i = 0; i < apim.cons.length; i++) {
                html += '<span class="oi oi-minus text-danger" title="icon name" aria-hidden="true"></span> ' + apim.cons[i] + '<br />';
            }
            html += '</li>';
            html += '</ul>';

            if(apim.nb_stars) {
                html += '<div class="card-footer">';
                for(var i = 0; i < apim.nb_stars; i++) {
                    html += '<span class="oi oi-star text-success" title="icon name" aria-hidden="true"></span>';
                }
                if(apim.nb_stars < 5) {
                    for(var i = apim.nb_stars; i < 5; i++) {
                        html += '<span class="oi oi-star text-black-50" title="icon name" aria-hidden="true"></span>';
                    }
                }
                html += '</div>';
            }
            html += '</div>';
            html += '</div>';
            return html;
        }
    }

    var app = OCTO_APIM_APP.app || new OCTO_APIM_APP.app();
    app.init();

});
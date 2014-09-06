$(document).ready(function () {


    var User = Backbone.Model.extend({
        defaults: function () {
            return {
                //id: Users.nextId(),
                userName: '',//用户名
                password: '',//密码
                isActive: false//是否激活
            }
        },
        urlRoot: '/api/users',
        initialize: function () {
            this.on('invalid', function (model, error) {
                var err = Errors.where({ errorMsg: error });
                Errors.remove(err);
                Errors.add({ errorMsg: error })
            });
        },
        validate: function (attrs, option) {
            if (!attrs.userName) return "用户名不能为空!";
            if (!attrs.password) return "密码不能为空!";
        }

    });



    var UserList = Backbone.Collection.extend({
        model: User,
        url: '/api/users',
        //localStorage: new Backbone.LocalStorage("users"),
        //nextId: function () {
        //    if (!this.length) return 1;
        //    return this.last().get("id") + 1;
        //}
    });
    var Users = new UserList;

    var UserView = Backbone.View.extend({
        tagName: "tr",
        template: _.template($("#user_template").html()),
        events: {
            "click .btn-default": "edit",
            "click .btn-warning": "cancel",
            "click .btn-primary": "save",
            "click .btn-danger": "del",
            "keypress .password": "close",
            "keyprees .userName": "close"
        },
        render: function () {
            this.$el.html(this.template(this.model.toJSON()));
            this.editName = this.$("#editName");
            this.editPassword = this.$("#editPassword");
            this.editActive = this.$("input.isActive");
            this.viewName = this.$(".viewName");
            this.viewPassword = this.$(".viewPassword");
            return this;//返回view本身
        },
        edit: function (e) {
            this.$el.addClass("editing");
            this.editName.focus();
        },
        cancel: function (e) {
            this.$el.removeClass("editing");
        },
        save: function (e) {
            console.log(this.model.isNew());
            if (!this.editName.val()) return;
            if (!this.editPassword.val()) return;
            console.log(this.editActive.prop("checked"));
            this.model.save({ userName: this.editName.val(), password: this.editPassword.val(), isActive: this.editActive.prop('checked') });
            this.viewName.text(this.editName.val());
            this.viewPassword.text(this.editPassword.val());
            this.$el.removeClass("editing");
        },
        del: function (e) {

            $($(e.target).parent().parent().parent()).remove();
            this.model.destroy();
            this.$el.removeClass("editing");
        },
        close: function (e) {
            if (e.keyCode !== 13) return;
            this.save();
        }
    });

    var AppView = Backbone.View.extend({
        el: "body",
        initialize: function () {
            this.inputName = $("#inputName");
            this.inputPassword = $("#inputPassword");
            this.inputActive = $("#inputActive");

            this.listenTo(Users, "add", this.addOne);
            this.listenTo(Users, "reset", this.addAll);

            this.listenTo(Errors, "add", this.addOneE);
            this.listenTo(Errors, "remove", this.addAllE);

            Users.fetch();

        },

        events: {
            "click #btn_add": "createUser"
        },

        createUser: function (e) {
            e.preventDefault();
            Users.create({ userName: this.inputName.val(), password: this.inputPassword.val(), isActive: this.inputActive.prop("checked") });
        },

        addOne: function (user) {
            var user_view = new UserView({ model: user });
            console.log(user.isNew());
            if (user.isValid()) {
                $($("#error_list").html("").parent()).hide();
                $($("#user_list").append(user_view.render().el).parent()).show();
            }
        },
        addAll: function () {
            Users.each(this.addOne, this);
        },
        addOneE: function (err) {
            var error_view = new ErrorView({ model: err });
            $($("#error_list").append(error_view.render().el).parent()).show();

        },
        addAllE: function () {
            console.log(Errors.toJSON());
            Errors.each(this.addOneE, this);
            $($("#error_list").html("").parent()).show();
        }

    });

    var Error = Backbone.Model.extend({
        defaults: function () {
            return {
                errorMsg: ""
            }
        }
    });
    var ErrorList = Backbone.Collection.extend({
        model: Error,
        //localStorage: new Backbone.LocalStorage("errors")
    });
    var ErrorView = Backbone.View.extend({
        tagName: "li",
        //collection: ErrorList,
        template: _.template($("#error_template").html()),


        render: function () {

            this.$el.html(this.template(this.model.toJSON()));
            return this;
        }
    });
    var Errors = new ErrorList;
    var App = new AppView;



});
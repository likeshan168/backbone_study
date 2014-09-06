/// 

$(document).ready(function () {
    //模型

    var Todo = Backbone.Model.extend({
        defaults: function () {
            return {
                title: "empty todo ...",//名称
                order: Todos.nextOrder(),//序号
                done: false//标记是否已经完成
            }
        },
        toggle: function () {
            this.save({ done: !this.get('done') });//取反
        }
    });
    //集合
    var TodoList = Backbone.Collection.extend({
        //模型
        model: Todo,
        //本地存储
        localStorage: new Backbone.LocalStorage("todos-backbone"),
        //完成的任务
        done: function () {
            return this.where({ done: true });
        },
        //剩下的任务
        remaining: function () {
            return this.where({ done: false });
        },
        //序号
        nextOrder: function () {
            if (!this.length) return 1;
            return this.last().get("order") + 1;
        },
        comparator: 'order'
    });


    var Todos = new TodoList;
    //视图（任务视图）
    //事件：1、标记完成 2、编辑 3、删除

    var ItemView = Backbone.View.extend({
        tagName: "li",
        initialize: function () {
            this.listenTo(this.model, 'change', this.render);//重新渲染
            this.listenTo(this.model, 'destory', this.render);
        },
        template: _.template($("#item-template").html()),
        events: {
            "click #check_item": "check_item",
            "dbclick .view": "edit",
            "click .img-circle": "clear",
            "keypress .edit": "updateOnEnter",
            "blur .edit": "close"
        },

        check_item: function () {
            this.model.toggle();//改变状态
        },
        edit: function () {
            this.$el.addClass("editing");
            this.input.focus();
        },
        clear: function () {
            this.model.destory();
        },
        updateOnEnter: function (e) {
            if (e.keyCode === 13) this.close();
        },
        close: function () {
            var value = this.input.val();
            if (!value) this.clear();
            this.model.save({ title: value });
            this.$el.removeClass("editing");
        },

        //渲染视图
        render: function () {
            this.$el.html(this.template(this.model.toJSON()));
            this.$el.toggleClass('line_del', this.model.get("done"));
            this.input = this.$(".edit");
            return this;
        }
    });

    var AppView = Backbone.View.extend({
        el: $("#todoapp"),
        initialize: function () {
            this.input = $("#new_todo");
            this.allCheckbox = $("#toggle-all");

            this.listenTo(Todos, "add", this.addOne);
            this.listenTo(Todos, "reset", this.addAll);
            this.listenTo(Todos, "all", this.render);

            Todos.fetch();
        },
        events: {
            "keypress #new_todo": "createOnEnter",
            "click #toggle-all": "toggleAllCompleted"
        },
        render: function () {
            var done = Todos.done().length;
            var remaining = Todos.remaining().length;
            this.allCheckbox.checked = !remaining;
        },
        addOne: function (todo) {
            var view = new ItemView({ model: todo });
            console.log(view.render().el);
            $("#todo-list").append(view.render().el);
            console.log($("#todo-list"));
        },
        addAll: function () {
            Todos.each(this.addOne, this);
        },
        createOnEnter: function (e) {
            if (e.keyCode !== 13) return;
            if (!this.input.val()) return;
            Todos.create({ title: this.input.val() });
            this.input.val('');
        },
        toggleAllCompleted: function () {
            
            var done = this.allCheckbox.checked;
            console.log(this.allCheckbox);
            Todos.each(function (todo) {
                todo.save({ done: done });
            });
        }
    });

    var App = new AppView;

});




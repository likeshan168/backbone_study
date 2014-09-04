using backbone.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace backbone.Controllers
{
    public class UsersController : ApiController
    {
        // GET api/<controller>
        public IEnumerable<User> Get()
        {
            using (CosenDbDataContext db = new CosenDbDataContext())
            {
                return db.User.ToList();
            }
        }
        //获取
        // GET api/<controller>/5
        public User Get(int id)
        {
            using (CosenDbDataContext db = new CosenDbDataContext())
            {
                return db.User.FirstOrDefault(p => p.id == id);
            }
        }
        //create
        // POST api/<controller>
        public void Post(User user)
        {

            using (CosenDbDataContext db = new CosenDbDataContext())
            {
                db.User.InsertOnSubmit(user);
                db.SubmitChanges();
            }

        }
        //update
        // PUT api/<controller>/5
        public void Put(int id, User user)
        {
            using (CosenDbDataContext db = new CosenDbDataContext())
            {
                var u = db.User.FirstOrDefault(p => p.id == id);
                if (u != null)
                {

                    u.userName = user.userName;
                    u.password = user.password;
                    u.isActive = user.isActive;
                    db.SubmitChanges();
                }
            }
        }
        //删除
        // DELETE api/<controller>/5
        public void Delete(int id)
        {
            using (CosenDbDataContext db = new CosenDbDataContext())
            {
                var u = db.User.FirstOrDefault(p => p.id == id);
                if (u != null)
                {
                    db.User.DeleteOnSubmit(u);
                    db.SubmitChanges();
                }
            }
        }
    }
}
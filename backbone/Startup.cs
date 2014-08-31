using Microsoft.Owin;
using Owin;

[assembly: OwinStartupAttribute(typeof(backbone.Startup))]
namespace backbone
{
    public partial class Startup
    {
        public void Configuration(IAppBuilder app)
        {
            ConfigureAuth(app);
        }
    }
}

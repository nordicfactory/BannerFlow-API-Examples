using BannerFlowSample.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;

namespace BannerFlowSample
{
    public partial class Default : System.Web.UI.Page
    {
        protected void Page_Load(object sender, EventArgs e)
        {
            // Configure API connector
            BannerFlowAPI api = new BannerFlowAPI(
                "89d59bd33a8748d699cf3fb4f116d36d", // Your BannerFlow API key
                "a57b32eefeed49e9a633576a053e8181", // Your BannerFlow API secret
                "bannerflow-enterprise"             // Your BannerFlow account slug
            );

            // Present account slug in title
            litAccountSlug.Text = api.credentials.accountSlug;

            // Get available brands in account
            var brands = api.GetBrands();
            rptBrands.DataSource = brands;
            rptBrands.DataBind();

        }
    }
}
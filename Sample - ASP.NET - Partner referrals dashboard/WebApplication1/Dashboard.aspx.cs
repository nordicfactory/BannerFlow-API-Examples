using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using PartnerDashboard.Models;

namespace PartnerDashboard
{
    public partial class Dashboard : System.Web.UI.Page
    {
        protected void Page_Load(object sender, EventArgs e)
        {
            // Retrieve referrals associated with partner
            List<Referral> referrals = BannerFlowPartnerAPI.GetReferrals();
            
            // Present all referrals sorted by registration date
            rptReferrals.DataSource = referrals.OrderByDescending(referral => referral.created).ToList();
            rptReferrals.DataBind();

            // Show key numbers
            lblTotalRegistrations.Text = referrals.Count.ToString();
            lblTotalConversions.Text = referrals.FindAll(referral => referral.converted).Count.ToString();
            lblConversionRate.Text = (100 * referrals.FindAll(referral => referral.converted).Count / referrals.Count).ToString("F") + "%";


        }
    }
}
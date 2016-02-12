using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace PartnerDashboard.Models
{
    public class Referral
    {
        public string name { get; set; }
        public DateTime created { get; set; }
        public string ownerEmail { get; set; }
        public string ownerFirstName { get; set; }
        public string ownerLastName { get; set; }
        public string currentPlan { get; set; }
        public string friendlyCurrentPlan
        {
            get {
                switch (currentPlan) {
                    case "Demo":
                        return "In trial";
                    default:
                        return currentPlan;
                }
                
            }
        }
        public Boolean converted {
            get {
                return currentPlan != "Demo";
            }
        }
    }
}
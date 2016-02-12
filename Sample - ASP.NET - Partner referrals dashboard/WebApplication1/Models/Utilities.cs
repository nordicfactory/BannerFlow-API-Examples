using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace PartnerDashboard.Models
{
    public class Utilities
    {
        public static string FriendlyDate(DateTime date) {
            var str = "";
            TimeSpan timeAgo = DateTime.Now.Subtract(date);
            if (timeAgo.TotalMinutes < 20)
                str = "Just now";
            else if (timeAgo.TotalMinutes < 60)
                str = "This hour";
            else if (timeAgo.TotalHours < 24)
                if (timeAgo.TotalHours < 1.5)
                    str = "One hour ago";
                else
                    str = Math.Round(timeAgo.TotalHours) + " hours ago";
            else if (DateTime.Now.AddDays(-1).Date.CompareTo(date.Date) == 0)
                str = "Yesterday (" + date.ToString("HH:mm") + ")";
            else
                str = date.ToString("yyyy-MM-dd HH:mm");
            return str;
        }
    }
}
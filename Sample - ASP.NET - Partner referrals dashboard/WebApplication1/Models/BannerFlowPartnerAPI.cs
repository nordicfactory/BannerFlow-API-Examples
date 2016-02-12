using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Text;
using System.Web;
using System.Web.Script.Serialization;
using System.Configuration;

namespace PartnerDashboard.Models
{
    public class BannerFlowPartnerAPI
    {
        // Retrieves list of Referrals from BannerFlow Partner API
        public static List<Referral> GetReferrals() {
            // Get JSON response from API
            var json = GetApiResponse(String.Format("partners/{0}/accounts", Credentials.PartnerId));

            // Serialize JSON array to list of Referral objects
            var serializer = new JavaScriptSerializer();
            List<Referral> referrals = serializer.Deserialize<List<Referral>>(json);

            // Return list
            return referrals;
        }

        // Makes REST API call to API
        private static string GetApiResponse(string relativePath) {
            // Create web request object
            HttpWebRequest request = (HttpWebRequest)WebRequest.Create(Credentials.ApiEndPoint + relativePath);
            
            // Configure HTTP headers
            request.ContentType = "application/json";
            request.Headers.Add("Authorization", Credentials.BasicAuthorization);

            // Make request and return response
            try
            {
                WebResponse response = request.GetResponse();
                using (Stream responseStream = response.GetResponseStream())
                {
                    StreamReader reader = new StreamReader(responseStream, Encoding.UTF8);
                    return reader.ReadToEnd();
                }
            }
            catch (WebException ex)
            {
                WebResponse errorResponse = ex.Response;
                using (Stream responseStream = errorResponse.GetResponseStream())
                {
                    StreamReader reader = new StreamReader(responseStream, Encoding.GetEncoding("utf-8"));
                    String errorText = reader.ReadToEnd();
                }
                throw;
            }
            return "";
        }

        // Class that manages the API and Authentication details defined in web.config
        public class Credentials {
            public static string ApiEndPoint { get { return ConfigurationManager.AppSettings["ApiEndPoint"]; } }
            public static string ApiKey { get { return ConfigurationManager.AppSettings["ApiKey"]; } }
            public static string ApiSecret { get { return ConfigurationManager.AppSettings["ApiSecret"]; } }
            public static string PartnerId { get { return ConfigurationManager.AppSettings["PartnerId"]; } }

            // Supporting property that constructs the conventional Base64 authorization value used in the API requests
            public static string BasicAuthorization { get { 
                return "Basic " + Convert.ToBase64String(Encoding.UTF8.GetBytes(ApiKey + ":" + ApiSecret));
            } }
        }
    }
}
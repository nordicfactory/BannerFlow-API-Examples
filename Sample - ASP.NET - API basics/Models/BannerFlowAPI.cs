using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using RestSharp.Deserializers;

namespace BannerFlowSample.Models
{
    public class BannerFlowAPI
    {
        public Credentials credentials;
        private static string API_ENDPOINT = "https://developers.bannerflow.com/api/v1/";
        private RestAPIClient apiClient;
        public BannerFlowAPI(string key, string secret, string accountSlug) {
            // Store credentials
            credentials = new Credentials(key, secret, accountSlug);

            // Create rest API client
            apiClient = new RestAPIClient(API_ENDPOINT, credentials.key, credentials.secret);

        }
        /// <summary>
        /// Retrieves list of BannerFlow brands in given account
        /// </summary>
        /// <returns>List of brand</returns>
        public List<Brand> GetBrands() {
            var respBrands = apiClient.Request(String.Format("accounts/{0}/brands", credentials.accountSlug));

            var brandList = new JsonDeserializer().Deserialize<List<Brand>>(respBrands);
            foreach (Brand brand in brandList) {
                Console.WriteLine(brand.name);
            }
            return brandList;

        }


        /// <summary>
        /// Credentials class
        /// </summary>
        public class Credentials {
            public string key { get; set; }
            public string secret { get; set; }
            public string accountSlug { get; set; }

            public Credentials(string key, string secret, string accountSlug)
            {
                this.key = key;
                this.secret = secret;
                this.accountSlug = accountSlug;

            }
         }

        /// <summary>
        /// Brand class used to deserialize BannerFlow API response
        /// </summary>
        public class Brand {
            public string id {get;set;}
            public string slug { get; set; }
            public string name { get; set; }
            public string logoUrl { get; set; }
            public string defaultNetworkId { get; set; }

        }
    }
}
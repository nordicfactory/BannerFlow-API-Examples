using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Newtonsoft.Json;
using RestSharp;
using RestSharp.Authenticators;
using RestSharp.Deserializers;


namespace BannerFlowSample.Models
{
    public class RestAPIClient
    {
        private RestClient client { get; set; }

        public RestAPIClient(string baseUrl, string key, string secret) {
            // Create client pointing at API end-point
            client = new RestClient(baseUrl);

            // Appliy API credentials
            client.Authenticator = new HttpBasicAuthenticator(key, secret);
        }

        public IRestResponse Request(string relativeApiPath, Method method = Method.GET, Dictionary<String, string> headers = null) {
            // Makes simple request to 
            var request = new RestRequest(relativeApiPath, method);
            request.RequestFormat = DataFormat.Json; 
            IRestResponse response = client.Execute(request);

            // Returns response object
            return response;
        }

    }
}
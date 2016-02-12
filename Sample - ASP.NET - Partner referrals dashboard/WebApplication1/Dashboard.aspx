<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="Dashboard.aspx.cs" Inherits="PartnerDashboard.Dashboard" %>

<!DOCTYPE html>

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <title>Partner Dashboard Sample | BannerFlow</title>
    <link href="Styles.css" rel="stylesheet" />
</head>
<body>
    <form id="form1" runat="server">
        <div id="wrap">
            <h1>BannerFlow Partner Dashboard</h1>
            <div id="keynumbers">
                <div class="box">
                    <asp:Label ID="lblTotalRegistrations" runat="server"></asp:Label>
                    <div class="label">Registrations</div>
                </div>
                <div class="box">
                    <asp:Label ID="lblTotalConversions" runat="server"></asp:Label>
                    <div class="label">Conversions</div>
                </div>
                <div class="box">
                    <asp:Label ID="lblConversionRate" runat="server"></asp:Label>
                    <div class="label">Conversion rate</div>
                </div>
                <div style="clear:both"></div>
            </div>
            <h2>Referrals</h2>
            <asp:Repeater ID="rptReferrals" runat="server">
                <HeaderTemplate>
                    <table>
                        <thead>
                            <tr>
                                <td>Registered</td>
                                <td>Plan</td>
                                <td>Account name</td>
                                <td>User</td>
                                <td>Email</td>
                            </tr>
                        </thead>
                </HeaderTemplate>
                <ItemTemplate>
                    <tr class="converted-<%#Eval("converted")%>">
                        <td><%#PartnerDashboard.Models.Utilities.FriendlyDate((DateTime)Eval("created"))%></td>
                        <td><%#Eval("friendlyCurrentPlan")%></td>
                        <td><%#Eval("name")%></td>
                        <td><%#Eval("ownerFirstName")%> <%#Eval("ownerLastName")%></td>
                        <td><%#Eval("ownerEmail")%></td></tr>
                </ItemTemplate>
                <FooterTemplate>
                    </table>
                </FooterTemplate>
            </asp:Repeater>
        </div>
    </form>
</body>
</html>

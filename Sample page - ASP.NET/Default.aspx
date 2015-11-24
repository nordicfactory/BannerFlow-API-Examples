<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="Default.aspx.cs" Inherits="BannerFlowSample.Default" %>

<!DOCTYPE html>

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <title>BannerFlow API sample in C#.NET</title>
</head>
<body>
    <form id="form1" runat="server">
    <div>
    
        <h2>Brands found in account &quot;<asp:Literal ID="litAccountSlug" runat="server"></asp:Literal>&quot;</h2>

        <asp:Repeater ID="rptBrands" runat="server" ItemType="BannerFlowSample.Models.BannerFlowAPI+Brand">
            <ItemTemplate>
                <div style="float: left; margin-right: 10px; border: 1px solid #eee; padding: 6px;">
                    <asp:Image ImageUrl='<%# Eval("logoUrl") %>' runat="server" Width="140px" />
                </div>
            </ItemTemplate>
        </asp:Repeater>
    </div>
    </form>
</body>
</html>

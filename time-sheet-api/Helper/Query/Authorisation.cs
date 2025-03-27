namespace TimeSheetAPI.Helper.Query
{
    public static class Authorisation
    {
        public static readonly string GetAction = """
Select Action as ActionName, Url from Action A 
inner join ActionRoleMapping AR on  A.ActionId = AR.ActionId
inner join Role R on R.RoleId = AR.RoleId
inner join Employee E on E.RoleId = AR.RoleId
where
EmployeeId = @employeeId 
""";
    }

}
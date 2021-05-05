using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.Data.SqlClient;

namespace Project1.Services.SQL
{
    public class MSSQLDapper
    {
        public static string ConnectionString { get; set; }
        private SqlConnection _connection = null;
        private SqlTransaction _transaction = null;
        private static MSSQLDapper _instance;
        public static MSSQLDapper Instance
        {
            get
            {
                if (_instance == null) _instance = new MSSQLDapper();

                return _instance;
            }
        }

        public MSSQLDapper()
        {
            _connection = new SqlConnection(ConnectionString);
        }

        public void BeginTransaction()
        {
            _connection.Open();
            _transaction = _connection.BeginTransaction();
        }

        public void Commit()
        {
            _transaction.Commit();
            _connection.Close();

            _transaction = null;
            _connection = null;
        }

        public void Rollback()
        {
            _transaction.Rollback();
            _connection.Close();

            _transaction = null;
            _connection = null;
        }

        public async Task<IEnumerable<T>> GetQueryAsync<T>(string sql, object param)
        {
            return await Dapper.SqlMapper.QueryAsync<T>(_connection, sql, param, _transaction);
        }

        public async Task<IEnumerable<T>> GetFromXmlQueryAsync<T>(string xml, string sqlId, object param)
        {
            string sql = (new SqlManager(xml)).GetQuery(sqlId);
            return await this.GetQueryAsync<T>(sql, param);
        }

        public async Task<int> ExecuteAsync(string sql, object param)
        {
            return await Dapper.SqlMapper.ExecuteAsync(_connection, sql, param, _transaction);
        }

        public async Task<int> ExecuteFromXmlAsync(string xml, string sqlId, object param)
        {
            string sql = (new SqlManager(xml)).GetQuery(sqlId);

            return await this.ExecuteAsync(sql, param);
        }
    }
}
